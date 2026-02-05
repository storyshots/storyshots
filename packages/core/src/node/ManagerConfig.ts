import { ImageComparator } from './Compare/types';
import { UserDevice } from '../neutral/config';
import { AppServerFactory } from './AppServerFactory';

/**
 * https://storyshots.github.io/storyshots/API/run-modes/manager-config
 */
export type ManagerConfig = {
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/manager-config#paths
   */
  paths: {
    records: string;
    screenshots: string;
  };
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/manager-config#devices
   */
  devices: UserDevice[];
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/manager-config#preview
   */
  server: AppServerFactory;
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/manager-config#agentscount
   */
  agentsCount?: number;
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/manager-config#compare
   */
  compare?: ImageComparator;
};
