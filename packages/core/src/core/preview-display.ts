import { Story, StoryConfig, StoryTree } from './story';

export type ActiveStory =
  | undefined
  | {
      story: Story;
      config: StoryConfig;
    };

declare global {
  interface Window {
    /**
     * Preview gives all defined stories and expects active story to be returned
     */
    onPreviewReady(stories: StoryTree): ActiveStory;
  }
}
