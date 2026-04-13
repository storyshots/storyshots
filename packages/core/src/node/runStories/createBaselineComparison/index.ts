import { ExpectedBaseline } from '../BaselineStorage';
import { ActualBaseline } from '../createActualBaseline';
import { BaselineComparison } from '../../../neutral/run-event/BaselineComparison';
import { createJournalComparisonResult } from './createJournalComparisonResult';
import { createScreenshotComparisonResult } from './createScreenshotComparisonResult';

export async function createBaselineComparison(
  expected: ExpectedBaseline,
  actual: ActualBaseline,
): Promise<BaselineComparison> {
  return {
    screenshots: await createScreenshotComparisonResult(
      expected.screenshots,
      actual.screenshots,
    ),
    journal: createJournalComparisonResult(expected.journal, actual.journal),
  };
}
