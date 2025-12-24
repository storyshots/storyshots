import { MouseMoveAction, parseRelativeMeasure } from '@core';
import { Frame } from 'playwright';

export async function doMouseMove(preview: Frame, move: MouseMoveAction) {
  const size = await preview
    .page()
    .locator('#preview')
    .evaluate((element) => element.getBoundingClientRect());

  const { x, y } = move.payload;

  return preview
    .page()
    .mouse.move(
      size.left +
        (typeof x === 'number' ? x : size.width * parseRelativeMeasure(x)),
      size.top +
        (typeof y === 'number' ? y : size.height * parseRelativeMeasure(y)),
      move.payload.options,
    );
}
