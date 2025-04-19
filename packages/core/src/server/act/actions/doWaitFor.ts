import { WaitForAction } from '@core';
import { Frame } from 'playwright';
import { select } from '../../select';

export function doWaitFor(preview: Frame, waitFor: WaitForAction) {
  return select(preview, waitFor.payload.on).waitFor({
    state: waitFor.payload.state,
  });
}
