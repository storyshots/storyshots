import { StoryEnvironment } from '../story-config';
import { assertScreenshotNameConditions, ScreenshotName } from './screenshot';
import { ActionMeta, Actor } from './types';

export function createActor(
  config: StoryEnvironment,
  meta: ActionMeta[] = [],
): Actor {
  const actor: Actor = {
    click: (on, options) =>
      withAction({
        action: 'click',
        payload: { on: on.__toMeta(), options },
      }),
    dblclick: (on, options) =>
      withAction({
        action: 'dblclick',
        payload: { on: on.__toMeta(), options },
      }),
    fill: (on, text, options) =>
      withAction({
        action: 'fill',
        payload: { on: on.__toMeta(), text, options },
      }),
    hover: (on, options) =>
      withAction({
        action: 'hover',
        payload: { on: on.__toMeta(), options },
      }),
    select: (on, values, options) =>
      withAction({
        action: 'select',
        payload: { on: on.__toMeta(), values, options },
      }),
    uploadFile: (chooser, paths, options) =>
      withAction({
        action: 'uploadFile',
        payload: {
          chooser: chooser.__toMeta(),
          paths: Array.isArray(paths) ? paths : [paths],
          options,
        },
      }),
    scrollTo: (to, options) =>
      withAction({
        action: 'scrollTo',
        payload: { on: to.__toMeta(), options },
      }),
    clear: (on, options) =>
      withAction({
        action: 'clear',
        payload: { on: on.__toMeta(), options },
      }),
    highlight: (on) =>
      withAction({ action: 'highlight', payload: { on: on.__toMeta() } }),
    wait: (ms) => withAction({ action: 'wait', payload: { ms } }),
    screenshot: (name, options) =>
      withAction({
        action: 'screenshot',
        payload: {
          name: name as ScreenshotName,
          mask: options?.mask?.map((selector) => selector.__toMeta()),
          maskColor: options?.maskColor,
        },
      }),
    keyboard: {
      press: (input, options) =>
        withAction({
          action: 'keyboard',
          payload: { type: 'press', input, options },
        }),
      down: (input) =>
        withAction({ action: 'keyboard', payload: { type: 'down', input } }),
      up: (input) =>
        withAction({ action: 'keyboard', payload: { type: 'up', input } }),
    },
    mouse: {
      move: (x, y, options) =>
        withAction({ action: 'mouseMove', payload: { x, y, options } }),
      up: (options) =>
        withAction({ action: 'mouseUpDown', payload: { type: 'up', options } }),
      down: (options) =>
        withAction({
          action: 'mouseUpDown',
          payload: { type: 'down', options },
        }),
      wheel: (dx, dy) =>
        withAction({ action: 'mouseWheel', payload: { dx, dy } }),
    },
    drag: (draggable, to, options) =>
      withAction({
        action: 'drag',
        payload: {
          draggable: draggable.__toMeta(),
          to: to.__toMeta(),
          options,
        },
      }),
    blur: (on, options) =>
      withAction({
        action: 'blur',
        payload: { on: on.__toMeta(), options },
      }),
    pressSequentially: (on, text, options) =>
      withAction({
        action: 'pressSequentially',
        payload: { on: on.__toMeta(), text, options },
      }),
    exec: (fn) =>
      withAction({ action: 'exec', payload: { fn: fn.toString() } }),
    waitFor: (on, state, timeout) =>
      withAction({
        action: 'waitFor',
        payload: { on: on.__toMeta(), state, timeout },
      }),
    resize: (viewport) => withAction({ action: 'resize', payload: viewport }),
    do: (transform) => transform(actor, config),
    stop: () => withAction({ action: 'stop' }),
    __toMeta: () => assertScreenshotNameConditions(meta),
  };

  function withAction(action: ActionMeta) {
    return createActor(config, [...meta, action]);
  }

  return actor;
}
