import type { Locator } from 'playwright';
import { Finder, FinderMeta } from '../finder/types';
import { StoryEnvironment } from '../story-config';
import { ScreenshotName } from './screenshot';

export type ActorTransformer = (
  actor: Actor,
  config: StoryEnvironment,
) => Actor;

export type Actor = MetaActionsFactory & {
  hover(on: Finder, options?: HoverAction['payload']['options']): Actor;

  click(on: Finder, options?: ClickAction['payload']['options']): Actor;

  dblclick(on: Finder, options?: DblClickAction['payload']['options']): Actor;

  fill(
    on: Finder,
    text: string,
    options?: FillAction['payload']['options'],
  ): Actor;

  wait(ms: number): Actor;

  screenshot(name: string, options?: UserScreenshotOptions): Actor;

  scrollTo(to: Finder, options?: ScrollToAction['payload']['options']): Actor;

  select(
    on: Finder,
    values: SelectAction['payload']['values'],
    options?: SelectAction['payload']['options'],
  ): Actor;

  press(input: string): Actor;

  down(input: string): Actor;

  up(input: string): Actor;

  clear(on: Finder, options?: ClearAction['payload']['options']): Actor;

  uploadFile(chooser: Finder, ...paths: string[]): Actor;

  highlight(on: Finder): Actor;

  drag(draggable: Finder, to: Finder): Actor;

  blur(on: Finder, options?: BlurAction['payload']['options']): Actor;

  pressSequentially(
    on: Finder,
    text: string,
    options?: BlurAction['payload']['options'],
  ): Actor;

  exec(fn: () => unknown): Actor;

  waitFor(on: Finder, state: WaitForAction['payload']['state']): Actor;

  wheel(dx: number, dy: number): Actor;

  do(transformer: ActorTransformer): Actor;

  stop(): Actor;
};

export type MetaActionsFactory = {
  __toMeta(): ActionMeta[];
};

export type HoverAction = {
  action: 'hover';
  payload: {
    on: FinderMeta;
    options?: Parameters<Locator['hover']>[0];
  };
};

export type BlurAction = {
  action: 'blur';
  payload: {
    on: FinderMeta;
    options?: Parameters<Locator['blur']>[0];
  };
};

export type PressSequentiallyAction = {
  action: 'pressSequentially';
  payload: {
    on: FinderMeta;
    text: string;
    options?: Parameters<Locator['pressSequentially']>[1];
  };
};

export type ClickAction = {
  action: 'click';
  payload: {
    on: FinderMeta;
    options: Parameters<Locator['click']>[0];
  };
};

export type DblClickAction = {
  action: 'dblclick';
  payload: {
    on: FinderMeta;
    options: Parameters<Locator['dblclick']>[0];
  };
};

export type FillAction = {
  action: 'fill';
  payload: {
    on: FinderMeta;
    text: string;
    options?: Parameters<Locator['fill']>[1];
  };
};

export type ScrollToAction = {
  action: 'scrollTo';
  payload: {
    on: FinderMeta;
    options?: Parameters<Locator['scrollIntoViewIfNeeded']>[0];
  };
};

export type SelectAction = {
  action: 'select';
  payload: {
    on: FinderMeta;
    values: Parameters<Locator['selectOption']>[0];
    options?: Parameters<Locator['selectOption']>[1];
  };
};

export type KeyboardAction = {
  action: 'keyboard';
  payload: {
    type: 'press' | 'up' | 'down';
    input: string;
  };
};

export type ClearAction = {
  action: 'clear';
  payload: {
    on: FinderMeta;
    options?: Parameters<Locator['clear']>[0];
  };
};

export type WaitAction = {
  action: 'wait';
  payload: {
    ms: number;
  };
};

export type ScreenshotAction = {
  action: 'screenshot';
  payload: ScreenshotOptions & {
    name: ScreenshotName;
  };
};

export type ScreenshotOptions = {
  mask?: FinderMeta[];
  maskColor?: string;
};

export type UserScreenshotOptions = {
  mask?: Finder[];
  maskColor?: string;
};

export type UploadFileAction = {
  action: 'uploadFile';
  payload: {
    chooser: FinderMeta;
    paths: string[];
  };
};

export type HighlightAction = {
  action: 'highlight';
  payload: {
    on: FinderMeta;
  };
};

export type DragAction = {
  action: 'drag';
  payload: {
    draggable: FinderMeta;
    to: FinderMeta;
    options?: Parameters<Locator['dragTo']>[1];
  };
};

export type ExecAction = {
  action: 'exec';
  payload: { fn: string };
};

export type WaitForAction = {
  action: 'waitFor';
  payload: {
    on: FinderMeta;
    state: 'attached' | 'detached' | 'visible' | 'hidden';
  };
};

export type WheelAction = {
  action: 'wheel';
  payload: {
    dx: number;
    dy: number;
  };
};

export type ActionMeta =
  | ClickAction
  | DblClickAction
  | FillAction
  | HoverAction
  | WaitAction
  | ScrollToAction
  | ScreenshotAction
  | SelectAction
  | UploadFileAction
  | KeyboardAction
  | ClearAction
  | HighlightAction
  | DragAction
  | BlurAction
  | PressSequentiallyAction
  | ExecAction
  | WaitForAction
  | WheelAction;
