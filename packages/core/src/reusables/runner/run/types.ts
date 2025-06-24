import { Device, Mode, StoryID, StoryTree } from '@core';
import { DeviceToTestRunState } from '../types';

export type RunConfig = {
  on: Device[];
  stories: StoryTree;
  abort: AbortSignal;
  size: number;
  mode: Mode;
  onResult(id: StoryID, result: DeviceToTestRunState): void;
};
