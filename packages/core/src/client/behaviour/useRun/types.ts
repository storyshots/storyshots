import { StoryRunEvent } from '../../../reusables/runner/types';
import { ErrorStruct } from '../../../reusables/error';
import { Duration } from '../../../reusables/duration';
import { assertIsNever, isDefined, isNil } from '@lib';
import { StoryRunDetails, StoryRunState } from '../../../reusables/runner/StoryRunState';
import { StoryRunResult } from '../../../reusables/runner/StoryRunResult';
import { Visitor } from '../../../reusables/Visitor';

/**
 * StoryRunState adapted for UI needs
 */
export type UIStoryRunState =
  // undefined represents a story which was not run yet
  | undefined
  | {
      type: 'scheduled';
    }
  | {
      type: 'running';
    }
  | UIStoryRunStateDone;

export type UIStoryRunStateDone = {
  type: 'done';
  details: StoryRunDetails;
};

/*
 Bidirectional operations on UIStoryRunState
 including refining (e.g. reading) and expanding (e.g. writing).
*/
export const UIStoryRunState = {
  // Creates instances based cases data. Opposite to when
  create: {
    // Used to create UIStoryRunState from StoryRunEvent utilizing closure state
    onStoryRunEvent() {
      const events: StoryRunEvent[] = [];
      return function ([meta, state]: StoryRunEvent) {
        events.push([meta, state]);

        return StoryRunState.when<UIStoryRunState>(state, {
          onRunning: () => ({ type: 'running' }),
          onError: (error, { duration, retry }) => {
            if (retry) {
              return { type: 'running' };
            }

            return {
              type: 'done',
              details: {
                duration: Duration.sum(duration, ...retries()),
                data: error,
              },
            };
          },
          onDone: (details, { duration, retry }) => {
            if (retry) {
              return { type: 'running' };
            }

            return {
              type: 'done',
              details: {
                duration: Duration.sum(duration, ...retries()),
                data: {
                  type: 'success',
                  data: details,
                },
              },
            };
          },
        });

        function retries() {
          return events
            .filter((event) => event[0] === meta)
            .map((event) =>
              StoryRunState.when(event[1], {
                onError: (_, { duration, retry }) =>
                  retry ? duration : undefined,
                onDone: (_, { duration, retry }) =>
                  retry ? duration : undefined,
                otherwise: () => undefined,
              }),
            )
            .filter(isDefined);
        }
      };
    },
    error(error: ErrorStruct): UIStoryRunState {
      return {
        type: 'done',
        details: {
          data: error,
          duration: Duration.zero(),
        },
      };
    },
    scheduled(): UIStoryRunState {
      return { type: 'scheduled' };
    },
    running(): UIStoryRunState {
      return { type: 'running' };
    },
    empty(): UIStoryRunState {
      return undefined;
    },
  },
  // Switches execution based on result cases
  when: Visitor.when<UIStoryRunState, Cases>((result, handlers) => {
    if (isNil(result)) {
      return handlers.onNoResults();
    }

    switch (result.type) {
      case 'scheduled':
        return handlers.onScheduled();
      case 'running':
        return handlers.onRunning();
      case 'done': {
        if (result.details.data.type === 'error') {
          return handlers.onError(result.details.data, result.details);
        }

        return handlers.onDone(result.details.data.data, result.details);
      }
    }

    assertIsNever(result);
  }),
};

type Cases = {
  onNoResults(): void;
  onScheduled(): void;
  onRunning(): void;
  onError(error: ErrorStruct, meta: Meta): void;
  onDone(details: StoryRunResult, meta: Meta): void;
};

type Meta = { duration: Duration };
