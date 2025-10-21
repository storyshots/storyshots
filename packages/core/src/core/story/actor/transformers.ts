import { map } from '../struct';
import { ResizeAction, ScreenshotAction } from './types';
import { Finder, FinderMeta } from '../finder/types';
import { isNil } from '@lib';
import { ExtendableStoryTree, StoryEnvironment } from '@core';

// TODO: Add docs
export function masked<TArg>(
  options: MaskOptions,
  stories: ExtendableStoryTree<TArg>,
): ExtendableStoryTree<TArg> {
  return map(stories, (story) => ({
    ...story,
    act: (actor, config) => {
      const child = story.act(actor, config);

      return {
        ...child,
        __toMeta: () =>
          child.__toMeta().map((action) => {
            if (action.action !== 'screenshot') {
              return action;
            }

            const screenshot: ScreenshotAction = {
              action: 'screenshot',
              payload: {
                ...action.payload,
                mask: mergeMask(
                  options.mask.map((it) => it.__toMeta()),
                  action.payload.mask,
                ),
                maskColor: mergeColor(options.color, action.payload.maskColor),
              },
            };

            return screenshot;
          }),
      };
    },
  }));

  function mergeMask(override: FinderMeta[], source: FinderMeta[] | undefined) {
    if (isNil(source)) {
      return override;
    }

    return [...override, ...source];
  }

  function mergeColor(
    override: string | undefined,
    source: string | undefined,
  ) {
    return source ?? override;
  }
}

type MaskOptions = {
  mask: Finder[];
  color?: string;
};

// TODO: Add docs
export function resized<TArg>(
  resize: (config: StoryEnvironment) => ResizeAction['payload'] | undefined,
  stories: ExtendableStoryTree<TArg>,
): ExtendableStoryTree<TArg> {
  return map(stories, (story) => ({
    ...story,
    act: (actor, config) => {
      const child = story.act(actor, config);
      const viewport = resize(config);

      if (isNil(viewport)) {
        return child;
      }

      return {
        ...child,
        __toMeta: () => {
          const actions = child.__toMeta();

          // TODO: Provide safer approach to avoiding mutating empty actions
          if (actions.length === 0) {
            return actions;
          }

          return [{ action: 'resize', payload: viewport }, ...actions];
        },
      };
    },
  }));
}
