import { StoryTree } from '../StoryTree';
import { map } from './map';

/**
 * https://storyshots.github.io/storyshots/API/utils/only
 */
export function only<TArg>(
  devices: string[],
  stories: StoryTree<TArg>,
): StoryTree<TArg> {
  return map(stories, (story) => ({
    ...story,
    act: (actor, config) =>
      devices.includes(config.device.name)
        ? story.act(actor, config)
        : { toMeta: () => [] },
  }));
}
