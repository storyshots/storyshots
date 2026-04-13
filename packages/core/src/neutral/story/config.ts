import { Journal } from '../Journal';
import { Brand } from '@storyshots/utils';

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
};

/**
 * Represents unique device identifier
 */
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

export const Device = {
  create: (device: UserDevice): Device => device as Device,
};

export type UserDevice = Omit<Device, 'name'> & { name: string };
