import { StoryRunEvent } from '../../../reusables/runner/types';
import { isDefined, isNil } from '@lib';
import { StoryRunState } from '../../../reusables/runner/StoryRunState';
import { Either } from '../../../reusables/Either';
import { RunnableStoryMeta } from '@core';
import { ErrorStruct } from '../../../reusables/error';
import { StoryRunResult } from '../../../reusables/runner/StoryRunResult';

export function createResults(
  prev?: [StoryRunEvent, { events(): StoryRunEvent[] }],
) {
  const events: StoryRunEvent[] = isNil(prev)
    ? []
    : [...prev[1].events(), prev[0]];

  const results = {
    events() {
      return events;
    },
    done() {
      return outcomes()
        .map((outcome) =>
          Either.when(outcome[1], {
            onRight: (right) => [outcome[0], right] as const,
            onLeft: () => undefined,
          }),
        )
        .filter(isDefined);
    },
    errors() {
      return outcomes()
        .map((outcome) =>
          Either.when(outcome[1], {
            onLeft: (left) => [outcome[0], left] as const,
            onRight: () => undefined,
          }),
        )
        .filter(isDefined);
    },
    changes() {
      return outcomes()
        .map((outcome) =>
          Either.when(outcome[1], {
            onLeft: () => undefined,
            onRight: (right) => {
              const changes = StoryRunResult.changes(right);

              return changes ? ([outcome[0], changes] as const) : undefined;
            },
          }),
        )
        .filter(isDefined);
    },
    attempts(story: RunnableStoryMeta) {
      return events.filter(
        (event) =>
          event[0] === story &&
          StoryRunState.when(event[1], {
            onRunning: () => false,
            otherwise: () => true,
          }),
      );
    },
  };

  return results;

  function outcomes() {
    return events
      .map((event) =>
        StoryRunState.when<
          [RunnableStoryMeta, Either<ErrorStruct, StoryRunResult>] | undefined
        >(event[1], {
          onDone: (details, { retry }) =>
            retry ? undefined : [event[0], Either.right(details)],
          onError: (error, { retry }) =>
            retry ? undefined : [event[0], Either.left(error)],
          otherwise: () => undefined,
        }),
      )
      .filter(isDefined);
  }
}

export type Results = ReturnType<typeof createResults>;
