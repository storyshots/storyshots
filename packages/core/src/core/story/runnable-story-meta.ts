import {
  ActionMeta,
  createActor,
  Device,
  flat,
  Story,
  StoryEnvironment,
  StoryTree,
} from '@core';
import { isNil } from '@lib';

export function toRunnableStoryMetas(
  stories: StoryTree,
  devices: Device[],
  { previewing }: { previewing: boolean },
): WithPossibleInitializationError<RunnableStoryMeta[]> {
  const tests = flat(stories).flatMap((story) =>
    devices.map((device) => [story, device] as const),
  );

  const results: RunnableStoryMeta[] = [];
  for (const [story, device] of tests) {
    const runnable = toRunnableStoryMeta(story, device, { previewing });

    if (runnable.type === 'error') {
      return runnable;
    }

    if (isNil(runnable.data)) {
      continue;
    }

    results.push(runnable.data);
  }

  return {
    type: 'success',
    data: results,
  };
}

export function toRunnableStoryMeta(
  story: Story,
  device: Device,
  { previewing }: { previewing: boolean },
): WithPossibleInitializationError<RunnableStoryMeta | undefined> {
  return withPossibleStoryError(story, device, () => {
    const env: StoryEnvironment = {
      device,
      previewing,
    };

    const actions = story.act(createActor(env), env).__toMeta();

    // A story with no actions (even FINAL screenshot) is considered to be empty
    if (actions.length === 0) {
      return;
    }

    const retries = story.retries(device);

    return {
      story,
      retries,
      actions,
      device,
    };
  });
}

function withPossibleStoryError<T>(
  story: Story,
  device: Device,
  fn: () => T,
): WithPossibleInitializationError<T> {
  try {
    return {
      type: 'success',
      data: fn(),
    };
  } catch (error: unknown) {
    return {
      type: 'error',
      story,
      device,
      message:
        typeof error === 'object' && error !== null && 'stack' in error
          ? `${error.stack}`
          : `${error}`,
    };
  }
}

/**
 * Represents ready to run, unfolded, json-like story with concrete device and actions
 */
export type RunnableStoryMeta = {
  story: ShallowOmitFunctions<Story>;
  actions: ActionMeta[];
  device: Device;
  retries: number;
};

/**
 * Disallows usage of act, arrange etc. functions because they are not available on node env.
 *
 * Omits only functions appearing on first level of a record for simplicity.
 */
type ShallowOmitFunctions<T> = {
  [TKey in keyof T as T[TKey] extends (...args: never[]) => unknown
    ? never
    : TKey]: T[TKey];
};

// Extended kind of WithPossibleError
export type WithPossibleInitializationError<T> =
  | {
      type: 'success';
      data: T;
    }
  | InitializationError;

export type InitializationError = {
  type: 'error';
  message: string;
  story: Story;
  device: Device;
};
