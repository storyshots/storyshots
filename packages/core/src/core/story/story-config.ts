import { Brand } from '../brand';
import { Journal } from './journal/types';

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
   * https://storyshots.github.io/storyshots/API/story-elements/story-config#testing
   */
  testing: boolean;
};

export type DeviceName = Brand<string, 'DeviceName'>;

/**
 * https://storyshots.github.io/storyshots/API/story-elements/device
 */
export type Device = DeviceDimensions & {
  name: DeviceName;
  userAgent?: string;
};

export type DeviceDimensions = { width: number; height: number };
