import { Brand } from '../brand';
import { Journal } from './journal';

/**
 * https://storyshots.github.io/storyshots/API/test-components/story-config
 */
export type StoryConfig = StoryEnvironment & {
  /**
   * https://storyshots.github.io/storyshots/API/test-components/story-config#journal
   */
  journal: Journal;
};

/**
 * https://storyshots.github.io/storyshots/API/test-components/story-config
 */
export type StoryEnvironment = {
  /**
   * https://storyshots.github.io/storyshots/API/test-components/story-config#device
   */
  device: Device;
  /**
   * https://storyshots.github.io/storyshots/API/test-components/story-config#previewing
   */
  previewing: boolean;
};

export type DeviceName = Brand<string, 'DeviceName'>;

/**
 * https://storyshots.github.io/storyshots/API/test-components/story-config#device
 */
export type Device = {
  name: DeviceName;
  userAgent?: string;
  width: number;
  height: number;
};
