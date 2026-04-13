import { UserDevice } from '../neutral/story/config';
import { AppServerFactory } from './AppServerFactory';

/**
 * https://storyshots.github.io/storyshots/API/run-modes/storyshots-config
 */
export type StoryshotsConfig = {
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/storyshots-config#paths
   */
  paths: {
    journal: string;
    screenshots: string;
  };
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/storyshots-config#devices
   */
  devices: UserDevice[];
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/storyshots-config#createserver
   */
  createServer: AppServerFactory;
  /**
   * https://storyshots.github.io/storyshots/API/run-modes/storyshots-config#agentscount
   */
  agentsCount?: number;
};
