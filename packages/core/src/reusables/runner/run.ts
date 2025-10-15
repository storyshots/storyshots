import { pool } from './pool';
import { RunConfig, StoryRunEvent } from './types';
import { RunnableStoryMeta } from '@core';
import { driver } from '../driver';
import { Duration } from '../duration';
import { WithPossibleError } from '../error';
import { StoryRunResult } from './StoryRunResult';
import { StoryRunDetails } from './StoryRunState';

/**
 * Runs provided tests in parallel using pool.
 *
 * Sends events notifying test state changes
 */
export function run(config: RunConfig) {
  return pool(
    config.stories.map((story) => createTestRun(config, story)),
    config.poolSize,
  );
}

async function* createTestRun(
  config: RunConfig,
  story: RunnableStoryMeta,
): AsyncGenerator<StoryRunEvent> {
  yield [story, { type: 'running' }];

  const details = yield* retryable(config, story);

  yield [story, { type: 'done', retry: false, details }];
}

async function* retryable(
  config: RunConfig,
  story: RunnableStoryMeta,
  attempt = 0,
): AsyncGenerator<StoryRunEvent, StoryRunDetails> {
  const measured = await Duration.measure(() => driver.test(story));

  if (story.retries === attempt) {
    return measured;
  }

  if (measured.data.type === 'error') {
    if (config.retryOnError) {
      return yield* retry();
    }

    return measured;
  }

  return yield* StoryRunResult.when(measured.data.data, {
    onFail: () => retry(),
    otherwise: async function* () {
      return measured;
    },
  });

  async function* retry(): AsyncGenerator<StoryRunEvent, StoryRunDetails> {
    yield [
      story,
      {
        type: 'done',
        retry: true,
        details: measured,
      },
    ];

    return yield* retryable(config, story, attempt + 1);
  }
}
