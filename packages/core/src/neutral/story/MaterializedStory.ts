import { Story, StoryAttributes, StoryMeta, StoryTree } from './StoryTree';
import { ActionMeta } from '../actor/types';
import { Device } from './config';
import { createActor } from '../actor';
import { Either, Failure } from '@storyshots/utils';

/**
 * Represents serializable story which can be safely pass as JSON and run later
 */
export type MaterializedStory =
  /**
   * Technically speaking, StoryAttributes should omit non-serializable entities.
   *
   * Leave as is for simplification reasons.
   */
  StoryAttributes<unknown> &
    StoryMeta & {
      actions: ActionMeta[];
      device: Device;
      retries: number;
    };

export type MaterializationResult = Either<
  MaterializeFailure,
  MaterializedStory[]
>;

export type MaterializeFailure = Failure<
  'MaterializeFailure',
  {
    story: StoryMeta;
    device: Device;
    cause: string;
  }
>;

export const MaterializedStory = {
  materialize: (stories: StoryTree, devices: Device[]): MaterializationResult =>
    materializeStories(stories, devices),
};

function materializeStories(
  stories: StoryTree,
  devices: Device[]
): MaterializationResult {
  if (!Array.isArray(stories)) {
    return stories.type === 'group'
      ? materializeStories(stories.children, devices)
      : materializeStory(stories, devices);
  }

  const materialized: MaterializedStory[] = [];

  for (const child of stories) {
    const result = materializeStories(child, devices);

    if (Either.isLeft(result)) {
      return result;
    }

    materialized.push(...result.value);
  }

  return Either.right(materialized);
}

function materializeStory(
  story: Story,
  devices: Device[]
): MaterializationResult {
  const materialized: MaterializedStory[] = [];

  for (const device of devices) {
    const result = computeStoryData(story, device);

    if (Either.isLeft(result)) {
      return result;
    }

    if (result.value.actions.length === 0) {
      continue;
    }

    materialized.push({
      ...story,
      ...result.value,
      device,
    });
  }

  return Either.right(materialized);
}

function computeStoryData(
  story: Story,
  device: Device
): Either<
  MaterializeFailure,
  {
    retries: number;
    actions: ActionMeta[];
  }
> {
  try {
    return Either.right({
      retries: story.retries(device),
      actions: story.act(createActor({ device }), { device }).toMeta(),
    });
  } catch (cause) {
    return Either.left({
      kind: 'MaterializeFailure',
      body: {
        story,
        device,
        cause: toSerializedError(cause),
      },
    });
  }
}

function toSerializedError(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.stack ?? cause.message;
  }

  return JSON.stringify(cause);
}
