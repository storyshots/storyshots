import { MouseMoveAction } from '@core';
import { Frame } from 'playwright';

export function doMouseMove(preview: Frame, move: MouseMoveAction) {
  return preview
    .page()
    .mouse.move(move.payload.x, move.payload.y, move.payload.options);
}
