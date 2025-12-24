import { Group, Story, StoryPayload, StoryTree } from './types';
import { createGroupID, createStoryID } from '../story-id';
import { mapAll } from './transformers';

// Extendable public interface of a story hierarchy
// TODO: Is there a simpler solution to store generic value and to maintain variance?
export type ExtendableStoryTree<TArg> =
  | (StoryTree & ({ __arg: TArg } | unknown))
  | ExtendableStoryTree<TArg>[];

export type ExtendableStory<TArg> = StoryAttributes<TArg> & Story;

// Interface used for ambient extensions of a story object
export interface StoryAttributes<TArg> {}

// TODO: Move to private space (toolkit)
export function createBindStoryFactories<TArg>(): StoryFactories<TArg> {
  const factories: StoryFactories<unknown> = {
    it: (title, config) => {
      return {
        id: createStoryID(title),
        type: 'story',
        title,
        parents: [],
        retries: () => 0,
        act: (actor) => actor,
        ...config,
      } satisfies Story;
    },
    describe: (title, children) => {
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
      } satisfies Group;
    },
    each: (elements, onEach) => elements.map(onEach),
  };

  return factories as StoryFactories<TArg>;
}

type StoryFactories<TArg> = {
  /**
   * https://storyshots.github.io/storyshots/API/factories/it
   */
  it(
    title: string,
    config: StoryAttributes<TArg> & Partial<StoryPayload>,
  ): ExtendableStoryTree<TArg>;

  /**
   * https://storyshots.github.io/storyshots/API/factories/describe
   */
  describe(
    title: string,
    children: ExtendableStoryTree<TArg>,
  ): ExtendableStoryTree<TArg>;

  /**
   * https://storyshots.github.io/storyshots/API/factories/each
   */
  each<T>(
    elements: T[],
    onEach: (element: T) => ExtendableStoryTree<TArg>,
  ): ExtendableStoryTree<TArg>;
};
