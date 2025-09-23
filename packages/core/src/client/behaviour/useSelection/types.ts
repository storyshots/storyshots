import { Device, ScreenshotName, Story, StoryID, StoryTree } from '@core';
import { WithPossibleError } from '../../../reusables/error';

export type Selection =
  | {
      type: 'initializing';
    }
  | ReadySelection;

export type ReadySelection = {
  stories: StoryTree;
} & _ReadySelection;

type _ReadySelection =
  | {
      type: 'no-selection';
    }
  | {
      type: 'story';
      story: Story;
      progress: Progress;
    }
  | {
      type: 'records';
      story: Story;
      device: Device;
    }
  | {
      type: 'screenshot';
      name: ScreenshotName;
      story: Story;
      device: Device;
    };

export type Progress =
  | { type: 'not-played' }
  | { type: 'playing' }
  | { type: 'played'; details: WithPossibleError<void> };

export type RecordsSelection = Extract<
  Selection,
  {
    type: 'records';
  }
>;

export type ScreenshotSelection = Extract<
  Selection,
  {
    type: 'screenshot';
  }
>;
