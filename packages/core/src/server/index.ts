import { runInBackground as _runInBackground } from './modes/runInBackground';
import { UserDefinedManagerConfig } from './types';

/**
 * https://storyshots.github.io/storyshots/API/manager/runInBackground
 */
export const runInBackground = async (config: UserDefinedManagerConfig) => {
  const { run, cleanup } = await _runInBackground(config);

  const result = await run();

  await cleanup();

  process.exit(result === 'fail' ? 1 : 0);
};

export { CAPTURE } from './modules/capture';
export { COMPARE } from './modules/compare';
export { RUNNER } from './modules/runner';

export type { UserDefinedManagerConfig, ManagerConfig } from './types';

export type { PreviewServerFactory, IPreviewServer } from './types';

export { merge, tap } from './preview';

export { runUI } from './modes/runUI';
