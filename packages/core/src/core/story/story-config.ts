import { Brand } from '../brand';
import { Journal } from './journal';

/**
 * https://storyshots.github.io/storyshots/API/story-elements/story-config
 */
export type StoryConfig = StoryEnvironment & {
  /**
   * https://storyshots.github.io/storyshots/API/story-elements/story-config#journal
   */
  journal: Journal;
};

/**
 * https://storyshots.github.io/storyshots/API/story-elements/story-config
 */
export type StoryEnvironment = {
  /**
   * https://storyshots.github.io/storyshots/API/story-elements/story-config#device
   */
  device: Device;
  /**
   * https://storyshots.github.io/storyshots/API/story-elements/story-config#previewing
   */
  previewing: boolean;
};

export type DeviceName = Brand<string, 'DeviceName'>;

/**
 * https://storyshots.github.io/storyshots/API/story-elements/device
 */
export type Device = {
  name: DeviceName;
  userAgent?: string;
  width: number;
  height: number;
};
