import { ScreenshotName } from '../screenshot/ScreenshotName';

import { ScreenshotPath } from '../screenshot/Screenshot';
import { Journal } from '../Journal';

export type BaselineComparison = {
  journal: JournalComparisonResult;
  screenshots: ScreenshotComparisonResult[];
};

export const BaselineComparison = {
  isFailure: (comparison: BaselineComparison): boolean => {
    return (
      comparison.journal.type === 'fail' ||
      comparison.screenshots.some((it) => it.type === 'fail')
    );
  },
};

export type JournalComparisonResult =
  | FreshJournal
  | FailedJournal
  | PassJournal;

export type ScreenshotComparisonResult =
  | FreshScreenshot
  | FailedScreenshot
  | PassScreenshot;

type FreshJournal = {
  type: 'fresh';
  actual: Journal;
};

type FailedJournal = {
  type: 'fail';
  actual: Journal;
  expected: Journal;
};

type PassJournal = {
  type: 'pass';
  actual: Journal;
};

type FreshScreenshot = {
  type: 'fresh';
  actual: ScreenshotPath;
  name: ScreenshotName;
};

type FailedScreenshot = {
  type: 'fail';
  actual: ScreenshotPath;
  expected: ScreenshotPath;
  name: ScreenshotName;
  diff?: ScreenshotPath;
  explanation?: string;
};

type PassScreenshot = {
  type: 'pass';
  actual: ScreenshotPath;
  expected: ScreenshotPath;
  name: ScreenshotName;
};
