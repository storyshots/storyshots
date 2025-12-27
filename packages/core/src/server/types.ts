import { Device } from '@core';
import { Capture } from './modules/capture';

import { Runner } from './modules/runner/types';
import { ImageComparator } from './modules/compare/types';

export type PreviewServerFactory = (
  mode: 'ui' | 'ci',
) => Awaitable<IPreviewServer>;

export interface IPreviewServer {
  at: string;

  cleanup(): Promise<unknown>;
}

type Awaitable<T> = Promise<T> | T;

/**
 * https://storyshots.github.io/storyshots/API/manager/manager-config
 */
export type UserDefinedManagerConfig = {
  /**
   * https://storyshots.github.io/storyshots/API/manager/manager-config#paths
   */
  paths: {
    records: string;
    screenshots: string;
  };
  /**
   * https://storyshots.github.io/storyshots/API/manager/manager-config#devices
   */
  devices: UserDefinedDevice[];
  /**
   * https://storyshots.github.io/storyshots/API/manager/manager-config#preview
   */
  preview: PreviewServerFactory | IPreviewServer;
  /**
   * https://storyshots.github.io/storyshots/API/manager/manager-config#runner
   */
  runner?: Runner;
  /**
   * https://storyshots.github.io/storyshots/API/manager/manager-config#capture
   */
  capture?: Capture;
  /**
   * https://storyshots.github.io/storyshots/API/manager/manager-config#compare
   */
  compare?: ImageComparator;
};

type UserDefinedDevice = Omit<Device, 'name'> & { name: string };

export type ManagerConfig = {
  paths: {
    records: string;
    screenshots: string;
  };
  preview: IPreviewServer;
  devices: Device[];
  runner: Runner;
  capture: Capture;
  compare: ImageComparator;
};
