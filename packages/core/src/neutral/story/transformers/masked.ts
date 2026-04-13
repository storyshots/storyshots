import { StoryTree } from '../StoryTree';
import { map } from './map';
import { ScreenshotAction } from '../../actor/types';
import { Finder, FinderMeta } from '../../finder/types';
import { isNil } from '@storyshots/utils';

/**
 * https://storyshots.github.io/storyshots/API/utils/masked
 */
export function masked<TArg>(
  options: MaskOptions,
  stories: StoryTree<TArg>,
): StoryTree<TArg> {
  return map(stories, (story) => ({
    ...story,
    act: (actor, config) => {
      const child = story.act(actor, config);

      return {
        ...child,
        __toMeta: () =>
          child.toMeta().map((action) => {
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
