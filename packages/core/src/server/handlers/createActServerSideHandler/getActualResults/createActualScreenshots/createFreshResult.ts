import { ScreenshotAction } from '@core';
import { ExpectedPayload } from '../types';
import { createActualScreenshotPath } from './createActualScreenshotPath';

import { ScreenshotComparisonResult } from '../../../../../reusables/runner/StoryRunResult';

export async function createFreshResult(
  payload: ExpectedPayload,
  action: ScreenshotAction,
  screenshot: Buffer,
): Promise<ScreenshotComparisonResult> {
  return {
    name: action.payload.name,
    type: 'fresh',
    actual: await createActualScreenshotPath(payload, action, screenshot),
  };
}
