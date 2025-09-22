import { runInBackground as _runInBackground } from './modes/runInBackground';
import { runUI as _runUI } from './modes/runUI';
import { CAPTURE } from './modules/capture';
import { COMPARE } from './modules/compare';
import { RUNNER } from './modules/runner';
import { IPreviewServer, PublicManagerConfig } from './types';

export type { IPreviewServer } from './types';

/**
 * https://storyshots.github.io/storyshots/API/manager/manager-config
 */
export type ManagerConfig = Optional<
  PublicManagerConfig,
  'runner' | 'compare' | 'capture'
>;

/**
 * https://storyshots.github.io/storyshots/API/manager/runUI
 */
export const runUI = (config: ManagerConfig) =>
  _runUI(fromOptimizedConfig(config));

/**
 * https://storyshots.github.io/storyshots/API/manager/runInBackground
 */
export const runInBackground = async (config: ManagerConfig) => {
  const { run, cleanup } = await _runInBackground(fromOptimizedConfig(config));

  await run();
  await cleanup();
};

export const mergeServe = (...handlers: IPreviewServer[]): IPreviewServer =>
  handlers.reduce(mergeTwoServeHandlers);

const mergeTwoServeHandlers = (
  left: IPreviewServer,
  right: IPreviewServer,
): IPreviewServer => ({
  handler: (req, res, next) =>
    left.handler(req, res, () => right.handler(req, res, next)),
  cleanup: async () => {
    await left.cleanup();
    await right.cleanup();
  },
});

function fromOptimizedConfig(config: ManagerConfig): PublicManagerConfig {
  return {
    compare: COMPARE.withPlaywright(),
    capture: CAPTURE.stabilized({
      attempts: 5,
      interval: (attempt) => 100 * Math.pow(2, attempt),
    }),
    runner: RUNNER.pool({ agentsCount: 1 }),
    ...config,
  };
}

type Optional<TRecord, TKey extends keyof TRecord> = Omit<TRecord, TKey> &
  Partial<Pick<TRecord, TKey>>;

export { CAPTURE } from './modules/capture';
export { COMPARE } from './modules/compare';
export { RUNNER } from './modules/runner';
