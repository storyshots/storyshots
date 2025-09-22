import { isNil } from '@lib';
import { Finder, FinderMeta, ScreenshotAction, StoryTree } from './story';
import { map } from './transformers';

/**
 * https://storyshots.github.io/storyshots/API/operators/only
 */
export function only<TExternals>(
  devices: string[],
  stories: StoryTree<TExternals>,
): StoryTree<TExternals> {
  return map(stories, (story) => ({
    ...story,
    act: (actor, config) =>
      devices.includes(config.device.name)
        ? story.act(actor, config)
        : { __toMeta: () => [] },
  }));
}

export function masked<TExternals>(
  options: MaskOptions,
  stories: StoryTree<TExternals>,
): StoryTree<TExternals> {
  return map(stories, (story) => ({
    ...story,
    act: (actor, config) => {
      const child = story.act(actor, config);

      return {
        ...child,
        __toMeta: () => {
          const meta = child.__toMeta();

          return meta.map((action) => {
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
          });
        },
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
