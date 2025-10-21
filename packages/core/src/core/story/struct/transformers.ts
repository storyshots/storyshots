import { ExtendableStory, ExtendableStoryTree } from './extendable';
import { Group, Story, StoryTree } from './types';
import { StoryID } from '../story-id';

/**
 * https://storyshots.github.io/storyshots/API/operators/map
 */
export function map<TArg>(
  stories: ExtendableStoryTree<TArg>,
  transform: (story: ExtendableStory<TArg>) => typeof story,
) {
  return mapAll(
    stories,
    transform,
    (group) => group,
  ) as ExtendableStoryTree<TArg>;
}

/**
 * https://storyshots.github.io/storyshots/API/operators/filter
 */
export function filter<TArg>(
  stories: ExtendableStoryTree<TArg>,
  predicate: (story: ExtendableStory<TArg>) => boolean,
) {
  return map(stories, (story) => ({
    ...story,
    act: (actor, config) =>
      predicate(story) ? story.act(actor, config) : { __toMeta: () => [] },
  }));
}

// TODO: Add docs
// TODO: Move to toolkit space (separate export entry for previews)
export function find<TArg>(
  id: StoryID,
  stories: ExtendableStoryTree<TArg>,
): ExtendableStory<TArg> | undefined {
  return flat(stories).find((story) => story.id === id);
}

export function mapAll(
  stories: StoryTree,
  onStory: (story: Story) => Story,
  onGroup: (group: Group) => Group,
): StoryTree {
  if (Array.isArray(stories)) {
    return stories.map((child) => mapAll(child, onStory, onGroup));
  }

  switch (stories.type) {
    case 'group':
      return {
        ...onGroup(stories),
        children: mapAll(stories.children, onStory, onGroup),
      };
    case 'story':
      return onStory(stories);
  }
}

export function flat(stories: StoryTree): Story[] {
  if (Array.isArray(stories)) {
    return stories.flatMap(flat);
  }

  switch (stories.type) {
    case 'group':
      return flat(stories.children);
    case 'story':
      return [stories];
  }
}
