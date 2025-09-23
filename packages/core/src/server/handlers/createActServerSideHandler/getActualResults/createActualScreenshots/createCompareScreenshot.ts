import { ScreenshotAction } from '@core';
import { isNil } from '@lib';
import { Frame } from 'playwright';
import { ExpectedPayload } from '../types';
import { capture } from './capture';
import { createFailResult } from './createFailResult';
import { createFreshResult } from './createFreshResult';
import { createPassResult } from './createPassResult';
import { equals } from './equals';
import { findExpected } from './findExpected';

import { ScreenshotComparisonResult } from '../../../../../reusables/runner/StoryRunResult';

export async function createCompareScreenshot(
  payload: ExpectedPayload,
  preview: Frame,
  action: ScreenshotAction,
): Promise<ScreenshotComparisonResult> {
  const actual = await capture(payload, preview, action);
  const expected = findExpected(payload, action);

  if (isNil(expected)) {
    return createFreshResult(payload, action, actual);
  }

  const compared = await equals(payload, actual, expected);

  if (compared.equal) {
    return createPassResult(payload, action, actual);
  }

  return createFailResult(payload, action, actual, expected, compared);
}
