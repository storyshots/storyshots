import {
  ExtendableStory,
  ExtendableStoryTree,
  StoryEnvironment,
} from './story';
import { AppFrameReference } from '../reusables/types';

declare global {
  interface Window {
    /**
     * Preview gives config and all defined stories.
     *
     * Expects active story to be returned.
     */
    onPreviewReady<TArg>(
      stories: ExtendableStoryTree<TArg>,
      config: { frame: AppFrameReference },
    ):
      | undefined
      | {
          story: ExtendableStory<TArg>;
          env: StoryEnvironment;
        };
  }
}
