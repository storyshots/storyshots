import { mapAll } from '../../transformers';
import { createGroupID, createStoryID } from '../story-id';
import { StoryTree } from '../types';
import { Group, Story, StoryAttributes, StoryPayload } from './types';

export const __bindStoryFactories = <TExternals>() => {
  return {
    /**
     * https://storyshots.github.io/storyshots/API/factories/it
     */
    it: (
      title: string,
      config: Partial<StoryPayload<TExternals>> & StoryAttributes<TExternals>,
    ): StoryTree<TExternals> => {
      return {
        id: createStoryID(title),
        type: 'story',
        title,
        parents: [],
        retries: () => 0,
        act: (actor) => actor,
        arrange: (externals) => externals,
        ...config,
      } satisfies Story<TExternals>;
    },
    /**
     * https://storyshots.github.io/storyshots/API/factories/describe
     */
    describe: (
      title: string,
      children: StoryTree<TExternals>,
    ): StoryTree<TExternals> => {
      const groupID = createGroupID(title);

      return {
        id: groupID,
        type: 'group',
        title,
        children: mapAll(
          children,
          (story) => ({
            ...story,
            id: createStoryID(story.id, groupID),
            parents: [title, ...story.parents],
          }),
          (group) => ({ ...group, id: createGroupID(group.id, groupID) }),
        ),
      } satisfies Group<TExternals>;
    },
    /**
     * https://storyshots.github.io/storyshots/API/factories/each
     */
    each: <T>(
      elements: T[],
      onEach: (element: T) => StoryTree<TExternals>,
    ): StoryTree<TExternals> => {
      return elements.map(onEach);
    },
  };
};
