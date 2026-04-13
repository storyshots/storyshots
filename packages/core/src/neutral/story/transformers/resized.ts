import { isNil } from '@storyshots/utils';
import { StoryEnvironment } from '../config';
import { ResizeAction } from '../../actor/types';
import { StoryTree } from '../StoryTree';
import { map } from './map';

/**
 * https://storyshots.github.io/storyshots/API/utils/resized
 */
export function resized<TArg>(
  resize: (config: StoryEnvironment) => ResizeAction['payload'] | undefined,
  stories: StoryTree<TArg>,
): StoryTree<TArg> {
  return map(stories, (story) => ({
    ...story,
    act: (actor, config) => {
      const child = story.act(actor, config);
      const viewport = resize(config);

      if (isNil(viewport)) {
        return child;
      }

      return {
        ...child,
        toMeta: () => {
          const actions = child.toMeta();

          if (actions.length === 0) {
            return actions;
          }

          return [{ action: 'resize', payload: viewport }, ...actions];
        },
      };
    },
  }));
}
