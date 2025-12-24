import { Device } from '@core';
import { RequestHandler } from 'express';
import { Capture } from './modules/capture';

import { Runner } from './modules/runner/types';
import { ImageComparator } from './modules/compare/types';

export type PreviewServerFactory = (
  config: ManagerConfig,
) => Awaitable<IPreviewServer>;

// TODO: Provide better names for preview (not always a server)
/**
 * https://storyshots.github.io/storyshots/modules/scheme#ipreviewserver
 */
export interface IPreviewServer {
  /**
   * https://storyshots.github.io/storyshots/modules/scheme#handler
   */
  handler: RequestHandler;

  /**
   * https://storyshots.github.io/storyshots/modules/scheme#cleanup
   */
  cleanup?(): Promise<unknown>;
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
  preview: PreviewServerFactory;
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

export type ManagerConfig = Required<UserDefinedManagerConfig> & {
  mode: 'ui' | 'background';
};
