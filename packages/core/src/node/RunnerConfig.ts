import { ImageComparator } from './Compare/types';
import { UserDevice } from '../neutral/config';
import { AppServerFactory } from './AppServerFactory';

/**
 * https://storyshots.github.io/storyshots/API/run-modes/runner-config
 */
export type RunnerConfig = {
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/runner-config#paths
   */
  paths: {
    records: string;
    screenshots: string;
  };
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/runner-config#devices
   */
  devices: UserDevice[];
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/runner-config#createserver
   */
  createServer: AppServerFactory;
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/runner-config#agentscount
   */
  agentsCount?: number;
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/runner-config#compare
   */
  compare?: ImageComparator;
};
