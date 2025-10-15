import { Frame } from 'playwright';
import { ResizeAction } from '@core';
import { assertNotEmpty } from '@lib';

export function doResize(preview: Frame, resize: ResizeAction) {
  const size = preview.page().viewportSize();

  assertNotEmpty(size);

  return preview.page().setViewportSize({ ...size, ...resize.payload });
}
