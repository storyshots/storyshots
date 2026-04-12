import { MaterializationResult } from './MaterializedStory';
import { AppArgs } from './AppArgs';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    onRunnerConnected?(args: AppArgs): MaterializationResult;
  }
}
