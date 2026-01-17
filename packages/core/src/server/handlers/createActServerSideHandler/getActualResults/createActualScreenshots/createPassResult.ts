import { ScreenshotAction } from '@core';
import { ExpectedPayload } from '../types';
import { createActualScreenshotPath } from './createActualScreenshotPath';

import { ScreenshotComparisonResult } from '../../../../../reusables/runner/StoryRunResult';
import { Screenshot } from '../../../../../reusables/types';

export async function createPassResult(
  payload: ExpectedPayload,
  action: ScreenshotAction,
  screenshot: Buffer,
  expected: Screenshot,
): Promise<ScreenshotComparisonResult> {
  return {
    name: action.payload.name,
    type: 'pass',
    actual: await createActualScreenshotPath(payload, action, screenshot),
    expected: expected.path,
  };
}
