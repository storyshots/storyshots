import { map } from './story';
import { ExtendableStoryTree } from './story';

/**
 * https://storyshots.github.io/storyshots/API/utils/only
 */
export function only<TArg>(
  devices: string[],
  stories: ExtendableStoryTree<TArg>,
): ExtendableStoryTree<TArg> {
  return map(stories, (story) => ({
    ...story,
    act: (actor, config) =>
      devices.includes(config.device.name)
        ? story.act(actor, config)
        : { __toMeta: () => [] },
  }));
}
