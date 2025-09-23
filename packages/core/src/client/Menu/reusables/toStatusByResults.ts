import { EntryStatus } from './types';
import { UIStoryRunState } from '../../behaviour/useRun/types';


import { StoryRunResult } from '../../../reusables/runner/StoryRunResult';

export function toStatusByResults(results: UIStoryRunState[]): EntryStatus {
  const statuses = results.map(toStatusByResult);

  if (statuses.every((status) => status === undefined)) {
    return undefined;
  }

  if (statuses.some((status) => status === 'running')) {
    return 'running';
  }

  if (statuses.some((status) => status === 'scheduled')) {
    return 'scheduled';
  }

  if (statuses.some((status) => status === 'error')) {
    return 'error';
  }

  if (statuses.some((status) => status === 'fail')) {
    return 'fail';
  }

  if (statuses.some((status) => status === 'fresh')) {
    return 'fresh';
  }

  return 'pass';
}

function toStatusByResult(result: UIStoryRunState): EntryStatus {
  return UIStoryRunState.when(result, {
    onNoResults: () => undefined,
    onRunning: () => 'running',
    onScheduled: () => 'scheduled',
    onError: () => 'error',
    onDone: (details) =>
      StoryRunResult.when(details, {
        onFail: () => 'fail',
        onFresh: () => 'fresh',
        onPass: () => 'pass',
      }),
  });
}
