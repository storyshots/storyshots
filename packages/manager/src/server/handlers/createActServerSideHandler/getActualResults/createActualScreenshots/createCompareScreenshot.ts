import { isNil, ScreenshotAction } from '@storyshots/core';
import { Frame } from 'playwright';
import { ScreenshotsComparisonResult } from '../../../../../reusables/runner/types';
import { ExpectedPayload } from '../types';
import { capture } from './capture';
import { createFailResult } from './createFailResult';
import { createFreshResult } from './createFreshResult';
import { createPassResult } from './createPassResult';
import { equals } from './equals';
import { findExpected } from './findExpected';

export async function createCompareScreenshot(
  payload: ExpectedPayload,
  preview: Frame,
  action: ScreenshotAction,
): Promise<ScreenshotsComparisonResult> {
  const actual = await capture(payload, preview);
  const expected = findExpected(payload, action);

  if (isNil(expected)) {
    return createFreshResult(payload, action, actual);
  }

  if (await equals(payload, actual, expected)) {
    return createPassResult(payload, action, actual);
  }

  return createFailResult(payload, action, actual, expected);
}
