import { Device, Mode } from '@core';
import { RequestHandler } from 'express';
import { Capture } from './modules/capture';

import { Runner } from './modules/runner/types';
import {ImageComparator} from "./modules/compare/types";

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
  cleanup(): Promise<unknown>;
}

export type ManagerConfig = {
  /**
   * https://storyshots.github.io/storyshots/API/manager/manager-config#paths
   */
  paths: {
    records: string;
    screenshots: string;
    temp: string;
  };
  /**
   * https://storyshots.github.io/storyshots/API/manager/manager-config#devices
   */
  devices: UserDefinedDevice[];
  /**
   * https://storyshots.github.io/storyshots/API/manager/manager-config#preview
   */
  preview: IPreviewServer;
  /**
   * https://storyshots.github.io/storyshots/API/manager/manager-config#runner
   */
  runner: Runner;
  /**
   * https://storyshots.github.io/storyshots/API/manager/manager-config#capture
   */
  capture: Capture;
  /**
   * https://storyshots.github.io/storyshots/API/manager/manager-config#compare
   */
  compare: ImageComparator;

  mode: Mode;
};

type UserDefinedDevice = Omit<Device, 'name'> & { name: string };

export type PublicManagerConfig = Omit<ManagerConfig, 'mode'>;
