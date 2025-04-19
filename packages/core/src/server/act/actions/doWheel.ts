import { WheelAction } from '@core';
import { Frame } from 'playwright';

export function doWheel(preview: Frame, wheel: WheelAction) {
  return preview.page().mouse.wheel(wheel.payload.dx, wheel.payload.dy);
}
