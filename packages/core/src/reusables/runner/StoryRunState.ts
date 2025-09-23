import { Duration, Measured } from '../duration';
import { ErrorStruct, WithPossibleError } from '../error';
import { StoryRunResult } from './StoryRunResult';
import { Visitor } from '../Visitor';

export type StoryRunState =
  | {
      type: 'running';
    }
  | {
      type: 'done';
      // Weather or not this result will be retried
      retry: boolean;
      details: StoryRunDetails;
    };

export type StoryRunDetails = Measured<WithPossibleError<StoryRunResult>>;

// Transforms (refines) StoryRunState to domain significant entities
export const StoryRunState = {
  when: Visitor.when<StoryRunState, Cases>((state, handlers) => {
    if (state.type === 'running') {
      return handlers.onRunning();
    }

    if (state.details.data.type === 'error') {
      return handlers.onError(state.details.data, {
        duration: state.details.duration,
        retry: state.retry,
      });
    }

    return handlers.onDone(state.details.data.data, {
      duration: state.details.duration,
      retry: state.retry,
    });
  }),
};

type Cases = {
  onRunning(): void;
  onError(error: ErrorStruct, meta: Meta): void;
  onDone(details: StoryRunResult, meta: Meta): void;
};

type Meta = {
  duration: Duration;
  retry: boolean;
};
