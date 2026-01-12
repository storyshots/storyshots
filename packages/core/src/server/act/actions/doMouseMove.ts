import { MouseMoveAction } from '@core';
import { Frame } from 'playwright';

export async function doMouseMove(preview: Frame, move: MouseMoveAction) {
  const size = await preview
    .page()
    .locator('#preview')
    .evaluate((element) => element.getBoundingClientRect());

  const { x, y } = move.payload;

  return preview
    .page()
    .mouse.move(size.left + x, size.top + y, move.payload.options);
}
