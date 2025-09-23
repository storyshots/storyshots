import path from 'path';
import { runUI as _runUI } from './modes/runUI';
import { CAPTURE } from './modules/capture';
import { COMPARE } from './modules/compare';
import { RUNNER } from './modules/runner';
import { IPreviewServer, PublicManagerConfig } from './types';
import * as process from 'node:process';

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
export const runInBackground = async () => {
  console.log({ tty: process.stdout.isTTY });

  void main();

  interface Reporter {
    onConfigure(config: {
      metadata: {
        actualWorkers: number;
      };
    }): void;

    // Даже на retry?
    onBegin(suite: { allTests(): { length: number } }): void;

    onTestBegin(test: Record<string, unknown>, result: { retry: number }): void;

    formatTestTitle(): string;

    onEnd(result: {}): void;
  }

  // npx ts-node C:\Users\khaimov\WebstormProjects\storyshots\tests\check.ts
  async function main() {
    const { default: LineReporter } = require(
      path.join(
        path.dirname(require.resolve('playwright')),
        '/lib/reporters/line.js',
      ),
    );

    const reporter: Reporter = new LineReporter();

    reporter.formatTestTitle = () => 'My title';

    reporter.onConfigure({
      metadata: {
        actualWorkers: 4,
      },
    });

    reporter.onBegin({
      allTests: () => ({ length: 10 }),
    });

    reporter.onTestBegin({}, { retry: 0 });

    setTimeout(() => reporter.onTestBegin({}, { retry: 0 }), 2_000);
  }
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
