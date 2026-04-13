import { RunEvent, RunResults } from '../../neutral/run-event/RunEvent';
import { RunContext } from './utils/RunContext';
import { ExpectedBaseline } from './BaselineStorage';
import { BaselineComparison } from '../../neutral/run-event/BaselineComparison';
import { createActualBaseline } from './createActualBaseline';
import { createBaselineComparison } from './createBaselineComparison';
import { Either, Stream } from '@storyshots/utils';

export async function* runStory(): Stream<RunEvent, void> {
  const { story, signal, retryOnError } = RunContext.use();

  yield { story, type: 'running' };

  const baseline = await ExpectedBaseline.create();
  signal.throwIfAborted();

  let attempt = 0;

  while (true) {
    const results = await tryRunStory(baseline);
    signal.throwIfAborted();

    const retryable = attempt < story.retries;
    const error = Either.isLeft(results) && retryOnError;
    const failure =
      Either.isRight(results) && BaselineComparison.isFailure(results.value);

    if (retryable && (error || failure)) {
      attempt += 1;

      yield { story, type: 'retrying', attempt, results };

      continue;
    }

    return yield { story, type: 'done', results };
  }
}

async function tryRunStory(expected: ExpectedBaseline): Promise<RunResults> {
  const { signal } = RunContext.use();

  const actual = await createActualBaseline();
  signal.throwIfAborted();

  if (Either.isLeft(actual)) {
    return actual;
  }

  const comparison = await createBaselineComparison(expected, actual.value);
  signal.throwIfAborted();

  return Either.right(comparison);
}
