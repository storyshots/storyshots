import {
  Group,
  GroupMeta,
  Story,
  StoryAttributes,
  StoryPayload,
  StoryTree,
} from './StoryTree';
import { ID } from './id';

/**
 * Binds story factories to provided generic arg.
 */
export function createStoryFactories<TArg>(): StoryFactories<TArg> {
  return {
    it: (title, config) =>
      ({
        type: 'story',
        id: ID.createStoryID(title),
        title,
        parents: [],
        retries: () => 0,
        act: (actor) => actor,
        ...config,
      } satisfies Story),
    describe: (title, children) => {
      const group: GroupMeta = {
        id: ID.createGroupID(title),
        title,
      };

      return {
        type: 'group',
        ...group,
        children: wrap(group, children),
      } satisfies Group;
    },
    each: (elements, onEach) => elements.map(onEach),
  };

  function wrap(group: GroupMeta, tree: StoryTree<TArg>): StoryTree<TArg> {
    if (Array.isArray(tree)) {
      return tree.map((child) => wrap(group, child));
    }

    if (tree.type === 'story') {
      return {
        ...tree,
        id: ID.prepend(group.id, tree.id),
        parents: [group, ...tree.parents],
      };
    }

    return {
      ...tree,
      id: ID.prepend(group.id, tree.id),
      children: wrap(group, tree.children),
    };
  }
}

type StoryFactories<TArg> = {
  /**
   * https://storyshots.github.io/storyshots/API/factories/it
   */
  it(
    title: string,
    config: StoryAttributes<TArg> & Partial<StoryPayload>
  ): StoryTree<TArg>;

  /**
   * https://storyshots.github.io/storyshots/API/factories/describe
   */
  describe(title: string, children: StoryTree<TArg>): StoryTree<TArg>;

  /**
   * https://storyshots.github.io/storyshots/API/factories/each
   */
  each<T>(
    elements: T[],
    onEach: (element: T) => StoryTree<TArg>
  ): StoryTree<TArg>;
};
