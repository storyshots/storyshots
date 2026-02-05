import { Story, StoryTree } from '../neutral/StoryTree';
import { StoryEnvironment } from '../neutral/config';
import { MaterializedStory } from '../neutral/MaterializedStory';
import { isNil } from '@storyshots/utils';
import { StoryID } from '../neutral/id';

/**
 * https://storyshots.github.io/storyshots/specification/arch#ipreviewclient
 */
export function createPreviewClientConnection<TArg>(stories: StoryTree<TArg>) {
  return new Promise<undefined | { story: Story<TArg>; env: StoryEnvironment }>(
    (resolve) => {
      window.createPreviewClientConnection = ({ devices, active }) => {
        handleActiveStory();

        return MaterializedStory.materialize(stories, devices);

        function handleActiveStory() {
          if (isNil(active)) {
            return resolve(undefined);
          }

          const story = find(active.id, stories);

          if (isNil(story)) {
            return resolve(undefined);
          }

          return resolve({ story, env: active.env });
        }
      };
    },
  );
}

function find<TArg>(
  id: StoryID,
  tree: StoryTree<TArg>,
): undefined | Story<TArg> {
  if (!Array.isArray(tree)) {
    if (tree.type === 'group') {
      return find(id, tree.children);
    }

    return tree.id === id ? tree : undefined;
  }

  for (const child of tree) {
    const story = find(id, child);

    if (story) {
      return story;
    }
  }

  return undefined;
}
