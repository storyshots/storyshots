import {
  ActionMeta,
  Brand,
  Device,
  JournalRecord,
  RunnableStoryMeta,
  ScreenshotName,
  StoryID,
  WithPossibleInitializationError,
} from '@core';
import { WithPossibleError } from './error';
import { ChangedRecords, ChangedScreenshot, StoryRunResult } from './runner/StoryRunResult';

export interface IWebDriver {
  play(actions: ActionMeta[]): Promise<WithPossibleError<void>>;

  test(story: RunnableStoryMeta): Promise<WithPossibleError<StoryRunResult>>;

  acceptScreenshot(screenshot: ChangedScreenshot): Promise<void>;

  acceptRecords(record: DeviceAndAcceptableRecords): Promise<void>;

  createImgSrc(path: ScreenshotPath): string;
}

export type DeviceAndAcceptableRecords = {
  id: StoryID;
  device: Device;
  records: ChangedRecords;
};

export type Screenshot = {
  name: ScreenshotName;
  path: ScreenshotPath;
};

// Represents full path to saved screenshot (either actual or expected)
export type ScreenshotPath = Brand<string, 'ScreenshotPath'>;

declare global {
  interface Window {
    getJournalRecords(): JournalRecord[];

    getAllStories(): undefined | WithPossibleInitializationError<RunnableStoryMeta[]>;
  }
}
