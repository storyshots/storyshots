import { ScreenshotAction, StoryTree } from './story';
import { map } from './transformers';

export function mapScreenshot<TExternals>(
  stories: StoryTree<TExternals>,
  onScreenshot: (
    payload: ScreenshotAction['payload'],
  ) => ScreenshotAction['payload'],
): StoryTree<TExternals> {
  return map(stories, (story) => ({
    ...story,
    act: (actor, device) => ({
      __toMeta: () => {
        const meta = story.act(actor, device).__toMeta();

        return meta.map((action) =>
          action.action === 'screenshot'
            ? { ...action, payload: onScreenshot(action.payload) }
            : action,
        );
      },
    }),
  }));
}
