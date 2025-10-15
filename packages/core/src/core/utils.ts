import { StoryTree } from './story';
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
