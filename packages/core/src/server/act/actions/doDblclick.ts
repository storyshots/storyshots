import { DblClickAction } from '@core';
import { Frame } from 'playwright';
import { select } from '../../select';

export function doDblclick(preview: Frame, dblclick: DblClickAction) {
  return select(preview, dblclick.payload.on).dblclick(
    dblclick.payload.options,
  );
}
