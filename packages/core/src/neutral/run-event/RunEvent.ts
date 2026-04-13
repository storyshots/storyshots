import { MaterializedStory } from '../story/MaterializedStory';
import { BaselineComparison } from './BaselineComparison';
import { Either } from '@storyshots/utils';

export type RunEvent = StoryAware &
  (
    | { type: 'running' }
    | {
        type: 'retrying';
        attempt: number;
        results: RunResults;
      }
    | { type: 'done'; results: RunResults }
  );

export type RunResults = Either<string, BaselineComparison>;

type StoryAware = {
  story: MaterializedStory;
};
