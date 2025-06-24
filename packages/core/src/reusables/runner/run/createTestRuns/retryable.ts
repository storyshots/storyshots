import { WithPossibleError } from '../../../types';
import { TestRunResult } from '../../types';
import { RunConfig } from '../types';
import { Test } from './createTests';

export function retryable(tests: Test[], config: RunConfig): Test[] {
  return tests.map((test) => ({
    ...test,
    run: () => withRetries(test.run, config, test.story.retries(test.device)),
  }));
}

async function withRetries(
  run: Test['run'],
  config: RunConfig,
  retries: number,
): Promise<WithPossibleError<TestRunResult>> {
  const result = await run();

  if (retries === 0) {
    return result;
  }

  if (result.type === 'error') {
    return config.mode === 'ui'
      ? result
      : withRetries(run, config, retries - 1);
  }

  if (
    result.data.screenshots.some((it) => it.type === 'fail') ||
    result.data.records.type === 'fail'
  ) {
    return withRetries(run, config, retries - 1);
  }

  return result;
}
