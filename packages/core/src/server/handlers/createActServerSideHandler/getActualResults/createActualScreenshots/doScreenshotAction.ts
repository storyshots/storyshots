import { ScreenshotAction } from '@core';
import { isNil } from '@lib';
import { Frame } from 'playwright';
import { PageScreenshotOptions } from 'playwright-core';
import { select } from '../../../../select';

export async function doScreenshotAction(
  preview: Frame,
  action: ScreenshotAction,
) {
  return preview.page().screenshot({
    type: 'png',
    caret: 'hide',
    animations: 'disabled',
    scale: 'css',
    ...toMaskOptions(preview, action),
  });
}

function toMaskOptions(
  preview: Frame,
  action: ScreenshotAction,
): PageScreenshotOptions {
  const mask = action.payload?.mask;

  if (isNil(mask) || mask.length === 0) {
    return {};
  }

  return {
    mask: mask.map((finder) => select(preview, finder)),
    maskColor: action.payload?.maskColor,
  };
}
