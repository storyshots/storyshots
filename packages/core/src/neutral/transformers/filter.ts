import { Story, StoryTree } from '../StoryTree';

/**
 * https://storyshots.github.io/storyshots/API/utils/filter
 */
export function filter<TArg>(
  stories: StoryTree<TArg>,
  predicate: (story: Story<TArg>) => boolean
): StoryTree<TArg> {
  if (Array.isArray(stories)) {
    return stories.flatMap((child) => {
      const filtered = filter(child, predicate);

      return isTreeEmpty(filtered) ? [] : [filtered];
    });
  }

  if (stories.type === 'story') {
    return predicate(stories) ? stories : [];
  }

  const filtered = filter(stories.children, predicate);

  if (isTreeEmpty(filtered)) {
    return [];
  }

  return {
    ...stories,
    children: filtered
  };
}

function isTreeEmpty(stories: StoryTree) {
  return Array.isArray(stories) && stories.length === 0;
}