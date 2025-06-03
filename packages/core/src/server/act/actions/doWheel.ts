import { MouseWheelAction } from '@core';
import { Frame } from 'playwright';

export function doWheel(preview: Frame, wheel: MouseWheelAction) {
  return preview.page().mouse.wheel(wheel.payload.dx, wheel.payload.dy);
}
