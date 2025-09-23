import { ScreenshotAction } from '@core';
import { ExpectedPayload } from '../types';
import { createActualScreenshotPath } from './createActualScreenshotPath';

import { ScreenshotComparisonResult } from '../../../../../reusables/runner/StoryRunResult';

export async function createPassResult(
  payload: ExpectedPayload,
  action: ScreenshotAction,
  screenshot: Buffer,
): Promise<ScreenshotComparisonResult> {
  return {
    name: action.payload.name,
    type: 'pass',
    actual: await createActualScreenshotPath(payload, action, screenshot),
  };
}
