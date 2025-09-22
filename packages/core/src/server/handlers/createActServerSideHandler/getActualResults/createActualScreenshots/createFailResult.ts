import { ScreenshotAction } from '@core';
import { ScreenshotComparisonResult } from '../../../../../reusables/runner/types';
import { Screenshot } from '../../../../../reusables/types';
import { ExpectedPayload } from '../types';
import { createActualScreenshotPath } from './createActualScreenshotPath';
import { NotEqualComparison } from '../../../../modules/compare/types';

export async function createFailResult(
  payload: ExpectedPayload,
  action: ScreenshotAction,
  actual: Buffer,
  expected: Screenshot,
  comparison: NotEqualComparison,
): Promise<ScreenshotComparisonResult> {
  const diff = comparison.diff
    ? await payload.baseline.createDiff(
        payload.story,
        action.payload.name,
        comparison.diff,
      )
    : undefined;

  return {
    name: action.payload.name,
    type: 'fail',
    actual: await createActualScreenshotPath(payload, action, actual),
    expected: expected.path,
    explanation: comparison.explanation,
    diff,
  };
}
