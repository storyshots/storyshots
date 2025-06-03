import { MouseUpDownAction } from '@core';
import { Frame } from 'playwright';

export function doMouseUpDown(preview: Frame, upDown: MouseUpDownAction) {
  return preview.page().mouse[upDown.payload.type](upDown.payload.options);
}
