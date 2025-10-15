import { ActionMeta, ScreenshotAction, StopAction } from '@core';
import { assertIsNever } from '@lib';
import { Frame } from 'playwright';
import { doBlur } from './actions/doBlur';
import { doClear } from './actions/doClear';
import { doClick } from './actions/doClick';
import { doDblclick } from './actions/doDblclick';
import { doDrag } from './actions/doDrag';
import { doExec } from './actions/doExec';
import { doFill } from './actions/doFill';
import { doHighlight } from './actions/doHighlight';
import { doHover } from './actions/doHover';
import { doKeyboard } from './actions/doKeyboard';
import { doMouseMove } from './actions/doMouseMove';
import { doMouseUpDown } from './actions/doMouseUpDown';
import { doPressSequentially } from './actions/doPressSequentially';
import { doScrollTo } from './actions/doScrollTo';
import { doSelect } from './actions/doSelect';
import { doUploadFile } from './actions/doUpload';
import { doWait } from './actions/doWait';
import { doWaitFor } from './actions/doWaitFor';
import { doWheel } from './actions/doWheel';
import { doResize } from './actions/doResize';

export async function act(
  preview: Frame,
  action: UserAction,
): Promise<unknown> {
  switch (action.action) {
    case 'click':
      return doClick(preview, action);
    case 'dblclick':
      return doDblclick(preview, action);
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
    case 'blur':
      return doBlur(preview, action);
    case 'pressSequentially':
      return doPressSequentially(preview, action);
    case 'exec':
      return doExec(preview, action);
    case 'waitFor':
      return doWaitFor(preview, action);
    case 'mouseWheel':
      return doWheel(preview, action);
    case 'mouseUpDown':
      return doMouseUpDown(preview, action);
    case 'mouseMove':
      return doMouseMove(preview, action);
    case 'resize':
      return doResize(preview, action);
  }

  assertIsNever(action);
}

type UserAction = Exclude<ActionMeta, ScreenshotAction | StopAction>;
