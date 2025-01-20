import { ActionMeta, assertIsNever, ScreenshotAction } from '@storyshots/core';
import { Frame } from 'playwright';
import { doClear } from './actions/doClear';
import { doClick } from './actions/doClick';
import { doDrag } from './actions/doDrag';
import { doFill } from './actions/doFill';
import { doHighlight } from './actions/doHighlight';
import { doHover } from './actions/doHover';
import { doKeyboard } from './actions/doKeyboard';
import { doScrollTo } from './actions/doScrollTo';
import { doSelect } from './actions/doSelect';
import { doUploadFile } from './actions/doUpload';
import { doWait } from './actions/doWait';

export async function act(
  preview: Frame,
  action: UserAction,
): Promise<unknown> {
  switch (action.action) {
    case 'click':
      return doClick(preview, action);
    case 'fill':
      return doFill(preview, action);
    case 'hover':
      return doHover(preview, action);
    case 'wait':
      return doWait(preview, action);
    case 'scrollTo':
      return doScrollTo(preview, action);
    case 'select':
      return doSelect(preview, action);
    case 'uploadFile':
      return doUploadFile(preview, action);
    case 'keyboard':
      return doKeyboard(preview, action);
    case 'clear':
      return doClear(preview, action);
    case 'highlight':
      return doHighlight(preview, action);
    case 'drag':
      return doDrag(preview, action);
  }

  assertIsNever(action);
}

type UserAction = Exclude<ActionMeta, ScreenshotAction>;
