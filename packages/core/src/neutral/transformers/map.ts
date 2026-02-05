import { Story, StoryTree } from '../StoryTree';

/**
 * https://storyshots.github.io/storyshots/API/utils/map
 */
export function map<TArg>(
  stories: StoryTree<TArg>,
  transform: (story: Story<TArg>) => Story<TArg>
): StoryTree<TArg> {
  if (Array.isArray(stories)) {
    return stories.map((story) => map(story, transform));
  }

  if (stories.type === 'story') {
    return transform(stories);
  }

  return {
    ...stories,
    children: map(stories.children, transform)
  };
}