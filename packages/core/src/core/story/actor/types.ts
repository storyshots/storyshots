import type { Locator, Page } from 'playwright';
import { FileChooser, Keyboard, Mouse } from 'playwright-core';
import { Finder, FinderMeta } from '../finder/types';
import { StoryEnvironment } from '../story-config';
import { ScreenshotName } from './screenshot';

export type ActorTransformer = (
  actor: Actor,
  config: StoryEnvironment,
) => Actor;

/**
 * https://storyshots.github.io/storyshots/API/test-components/actor
 */
export type Actor = MetaActionsFactory & {
  /**
   * https://playwright.dev/docs/api/class-locator#locator-hover
   */
  hover(on: Finder, options?: HoverAction['payload']['options']): Actor;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-click
   */
  click(on: Finder, options?: ClickAction['payload']['options']): Actor;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-dblclick
   */
  dblclick(on: Finder, options?: DblClickAction['payload']['options']): Actor;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-fill
   */
  fill(
    on: Finder,
    text: string,
    options?: FillAction['payload']['options'],
  ): Actor;

  /**
   * https://storyshots.github.io/storyshots/API/test-components/actor#wait
   */
  wait(ms: number): Actor;

  /**
   * https://storyshots.github.io/storyshots/API/test-components/actor#screenshot
   */
  screenshot(name: string, options?: UserScreenshotOptions): Actor;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-scroll-into-view-if-needed
   */
  scrollTo(to: Finder, options?: ScrollToAction['payload']['options']): Actor;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-select-option
   */
  select(
    on: Finder,
    values: SelectAction['payload']['values'],
    options?: SelectAction['payload']['options'],
  ): Actor;

  mouse: {
    /**
     * https://playwright.dev/docs/api/class-mouse#mouse-move
     */
    move(
      x: number,
      y: number,
      options?: MouseMoveAction['payload']['options'],
    ): Actor;
    /**
     * https://playwright.dev/docs/api/class-mouse#mouse-down
     */
    down(options?: MouseUpDownAction['payload']['options']): Actor;
    /**
     * https://playwright.dev/docs/api/class-mouse#mouse-up
     */
    up(options?: MouseUpDownAction['payload']['options']): Actor;
    /**
     * https://playwright.dev/docs/api/class-mouse#mouse-wheel
     */
    wheel(dx: number, dy: number): Actor;
  };

  keyboard: {
    /**
     * https://playwright.dev/docs/api/class-keyboard#keyboard-press
     */
    press(input: string, options?: KeyboardAction['payload']['options']): Actor;
    /**
     * https://playwright.dev/docs/api/class-keyboard#keyboard-down
     */
    down(input: string): Actor;
    /**
     * https://playwright.dev/docs/api/class-keyboard#keyboard-up
     */
    up(input: string): Actor;
  };

  /**
   * https://playwright.dev/docs/api/class-locator#locator-clear
   */
  clear(on: Finder, options?: ClearAction['payload']['options']): Actor;

  /**
   * https://storyshots.github.io/storyshots/API/test-components/actor#uploadfile
   */
  uploadFile(
    chooser: Finder,
    paths: string | string[],
    options?: UploadFileAction['payload']['options'],
  ): Actor;

  /**
   * https://storyshots.github.io/storyshots/API/test-components/actor#highlight
   */
  highlight(on: Finder): Actor;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-drag-to
   */
  drag(
    draggable: Finder,
    to: Finder,
    options?: DragAction['payload']['options'],
  ): Actor;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-blur
   */
  blur(on: Finder, options?: BlurAction['payload']['options']): Actor;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-press-sequentially
   */
  pressSequentially(
    on: Finder,
    text: string,
    options?: BlurAction['payload']['options'],
  ): Actor;

  /**
   * https://storyshots.github.io/storyshots/API/test-components/actor#exec
   */
  exec(fn: () => unknown): Actor;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-wait-for
   */
  waitFor(
    on: Finder,
    state: WaitForAction['payload']['state'],
    timeout?: WaitForAction['payload']['timeout'],
  ): Actor;

  /**
   * https://playwright.dev/docs/api/class-page#page-wait-for-url
   */
  waitForURL(
    url: WaitForURLAction['payload']['url'],
    options?: WaitForURLAction['payload']['options'],
  ): Actor;

  /**
   * https://storyshots.github.io/storyshots/API/test-components/actor#resize
   */
  resize(viewport: ResizeAction['payload']): Actor;

  /**
   * https://storyshots.github.io/storyshots/API/test-components/actor#do
   */
  do(transformer: ActorTransformer): Actor;

  /**
   * https://storyshots.github.io/storyshots/API/test-components/actor#stop
   */
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
    options?: Parameters<Keyboard['press' | 'up' | 'down']>[1];
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
    options?: {
      chooser?: Parameters<FileChooser['setFiles']>[1];
      upload?: ClickAction['payload']['options'];
    };
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
    timeout?: number;
  };
};

export type WaitForURLAction = {
  action: 'waitForURL';
  payload: {
    url: string | RegExp;
    options?: Parameters<Page['waitForURL']>[1];
  };
};

export type MouseMoveAction = {
  action: 'mouseMove';
  payload: {
    x: number;
    y: number;
    options?: Parameters<Mouse['move']>[2];
  };
};

export type MouseUpDownAction = {
  action: 'mouseUpDown';
  payload: {
    type: 'up' | 'down';
    options?: Parameters<Mouse['down' | 'up']>[0];
  };
};

export type MouseWheelAction = {
  action: 'mouseWheel';
  payload: {
    dx: number;
    dy: number;
  };
};

export type StopAction = {
  action: 'stop';
};

export type ResizeAction = {
  action: 'resize';
  payload: {
    width?: number;
    height?: number;
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
  | MouseWheelAction
  | MouseMoveAction
  | MouseUpDownAction
  | ResizeAction
  | StopAction
  | WaitForURLAction;
