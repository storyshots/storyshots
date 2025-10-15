import { assertNotEmpty } from '@lib';
import { chromium } from 'playwright';
import { createManagerRootURL } from '../../paths';
import { ManagerConfig } from '../../types';
import { createServer } from '../reusables/createServer';
import { createReporter } from './createReporter';
import { run } from '../../../reusables/runner/run';
import { driver } from '../../../reusables/driver';
import { RunnableStoryMeta } from '@core';
import { Duration } from '../../../reusables/duration';
import { createResults } from './createResults';

export async function runInBackground(config: ManagerConfig) {
  const server = await createServer(config);
  const reporter = createReporter(config);

  return {
    ...server,
    run: async (): Promise<'fail' | undefined> => {
      reporter.onInitialize();

      const { duration: building, data: result } = await Duration.measure(() =>
        getAllStories(config),
      );

      if (result.type === 'error') {
        reporter.onInitializeError(result);

        return 'fail';
      }

      const stories = result.data;

      reporter.onInitializeComplete(stories);

      const { duration: running, data: results } = await Duration.measure(() =>
        runAllStories(config, reporter, stories),
      );

      reporter.onAllStoriesRan(results);

      if (results.errors().length > 0) {
        reporter.onFinish({ building, running });

        return 'fail';
      }

      for (const [story, changes] of results.changes()) {
        const {
          story: { id },
          device,
        } = story;

        if (changes.records) {
          await driver.acceptRecords({
            id,
            device,
            records: changes.records,
          });
        }

        for (const screenshot of changes.screenshots) {
          await driver.acceptScreenshot(screenshot);
        }
      }

      reporter.onAfterChangesApplied(results);
      reporter.onFinish({ building, running });

      return;
    },
  };
}

async function getAllStories(config: ManagerConfig) {
  const browser = await chromium.launch();

  const page = await browser.newPage();

  await page.goto(createManagerRootURL(config).href, { timeout: 0 });

  const handle = await page.waitForFunction(
    () => window.getAllStories(),
    null,
    {
      timeout: 0,
    },
  );

  const result = await handle.jsonValue();

  await browser.close();

  assertNotEmpty(result);

  return result;
}

async function runAllStories(
  config: ManagerConfig,
  reporter: ReturnType<typeof createReporter>,
  stories: RunnableStoryMeta[],
) {
  const running = run({
    stories,
    retryOnError: true,
    poolSize: config.runner.size,
  });

  let results = createResults();
  for await (const event of running) {
    results = createResults([event, results]);

    reporter.onStoryStateChange(results);
  }

  return results;
}
