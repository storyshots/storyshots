import { assertNotEmpty } from '@lib';
import { chromium } from 'playwright';
import { UserDefinedManagerConfig } from '../../types';
import {
  createStoryshotsServer,
  StoryshotsServer,
} from '../reusables/createStoryshotsServer';
import { createReporter } from './createReporter';
import { run } from '../../../reusables/runner/run';
import { driver } from '../../../reusables/driver';
import { RunnableStoryMeta } from '@core';
import { Duration } from '../../../reusables/duration';
import { createResults } from './createResults';

/**
 * https://storyshots.github.io/storyshots/API/run-modes/runCI
 */
export async function runCI(config: UserDefinedManagerConfig) {
  const server = await createStoryshotsServer({
    ...config,
    preview:
      typeof config.preview === 'function'
        ? await config.preview('ci')
        : config.preview,
  });

  return initializeAndRunAllStories(server).finally(server.cleanup);
}

async function initializeAndRunAllStories(server: StoryshotsServer) {
  const reporter = createReporter(server);

  reporter.onInitialize();

  const { duration: building, data: result } = await Duration.measure(() =>
    getAllStories(server),
  );

  if (result.type === 'error') {
    reporter.onInitializeError(result);

    throw Error('Script failed.');
  }

  const stories = result.data;

  reporter.onInitializeComplete(stories);

  const { duration: running, data: results } = await Duration.measure(() =>
    runAllStories(server, reporter, stories),
  );

  reporter.onAllStoriesRan(results);

  if (results.errors().length > 0) {
    reporter.onFinish({ building, running });

    throw Error('Script failed.');
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
}

async function getAllStories(server: StoryshotsServer) {
  const browser = await chromium.launch({
    args: ['--disable-web-security'],
  });

  const page = await browser.newPage();

  await page.goto(server.root.href, { timeout: 0 });

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
  server: StoryshotsServer,
  reporter: ReturnType<typeof createReporter>,
  stories: RunnableStoryMeta[],
) {
  const running = run({
    stories,
    retryOnError: true,
    poolSize: server.config.runner.size,
  });

  let results = createResults();
  for await (const event of running) {
    results = createResults([event, results]);

    reporter.onStoryStateChange(stories, results);
  }

  return results;
}
