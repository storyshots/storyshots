import { JournalComparisonResult } from '../../../neutral/run-event/BaselineComparison';
import { Journal } from '../../../neutral/Journal';

export function createJournalComparisonResult(
  expected: Journal | undefined,
  actual: Journal,
): JournalComparisonResult {
  if (expected === undefined) {
    return { type: 'fresh', actual };
  }

  if (expected === actual) {
    return { type: 'pass', actual };
  }

  return {
    type: 'fail',
    actual,
    expected,
  };
}
