import { assertNotEmpty, isDefined } from '@lib';
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
import { createResults, Results } from './createResults';
import { globSync, unlinkSync } from 'node:fs';
import path from 'path';

/**
 * https://storyshots.github.io/storyshots/API/run-modes/runCI
 */
export async function runCI(
  config: UserDefinedManagerConfig & { cleanupObsolete?: boolean },
) {
  const server = await createStoryshotsServer({
    ...config,
    preview:
      typeof config.preview === 'function'
        ? await config.preview('ci')
        : config.preview,
  });

  return initializeAndRunAllStories(
    server,
    config.cleanupObsolete ?? true,
  ).finally(server.cleanup);
}

async function initializeAndRunAllStories(
  server: StoryshotsServer,
  cleanupObsolete: boolean,
) {
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

  if (cleanupObsolete) {
    await removeObsoleteScreenshots(server, results);
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

// TODO: Obsolete records must be removed as well
async function removeObsoleteScreenshots(
  server: StoryshotsServer,
  results: Results,
) {
  const expected = results
    .done()
    .flatMap(([_, result]) =>
      result.screenshots
        .map((it) =>
          it.type === 'fresh' ? undefined : (it.expected as string),
        )
        .filter(isDefined),
    );

  const storage = path.join(server.config.paths.screenshots, '**/*.png');

  const obsolete = globSync(storage).filter(
    (actual) => !expected.includes(actual),
  );

  if (obsolete.length === 0) {
    return;
  }

  for (const path of obsolete) {
    unlinkSync(path);
  }

  console.log('\n');

  console.log(obsolete.length, 'obsolete screenshots were removed');
}
