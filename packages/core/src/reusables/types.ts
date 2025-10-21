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
import {
  ChangedRecords,
  ChangedScreenshot,
  StoryRunResult,
} from './runner/StoryRunResult';

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
    /**
     * Exposes app frame ref for playwright and highlighter.
     * Must point to an iframe containing the app.
     */
    getAppFrameRef(): AppFrameReference;

    /**
     * Exposes journal record, must be defined inside iframe
     * to which getAppFrameRef() is pointing to.
     */
    getJournalRecords(): Promise<JournalRecord[]>;

    /**
     * Exposes list of all runnable stories for background run mode.
     */
    getAllStories():
      | undefined
      | WithPossibleInitializationError<RunnableStoryMeta[]>;
  }
}

/**
 * Describes reference to app content frame.
 *
 * TODO: Should be accessible only when story is selected in manager.
 *  Prefer type safe approach.
 */
export type AppFrameReference =
  | { type: 'self' }
  | { type: 'id'; value: string };
