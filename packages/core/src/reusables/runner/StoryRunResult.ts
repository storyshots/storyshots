import { JournalRecord, ScreenshotName } from '@core';
import { ScreenshotPath } from '../types';
import { Visitor } from '../Visitor';
import { isDefined } from '@lib';

export type StoryRunResult = {
  records: RecordsComparisonResult;
  screenshots: ScreenshotComparisonResult[];
};

export type ScreenshotComparisonResult =
  | FreshScreenshot
  | FailedScreenshot
  | PassScreenshot;

export type ChangedScreenshot = FreshScreenshot | FailedScreenshot;

export type FreshScreenshot = {
  type: 'fresh';
  actual: ScreenshotPath;
  name: ScreenshotName;
};

export type FailedScreenshot = {
  type: 'fail';
  actual: ScreenshotPath;
  expected: ScreenshotPath;
  name: ScreenshotName;
  diff?: ScreenshotPath;
  explanation?: string;
};

export type PassScreenshot = {
  type: 'pass';
  actual: ScreenshotPath;
  expected: ScreenshotPath;
  name: ScreenshotName;
};

export type RecordsComparisonResult =
  | FreshRecords
  | FailedRecords
  | PassRecords;

export type ChangedRecords = FreshRecords | FailedRecords;

export type FreshRecords = {
  type: 'fresh';
  actual: JournalRecord[];
};

export type FailedRecords = {
  type: 'fail';
  actual: JournalRecord[];
  expected: JournalRecord[];
};

export type PassRecords = {
  type: 'pass';
  actual: JournalRecord[];
};

type Cases = {
  onFail(changes: FailedChanges): void;
  onFresh(changes: FreshChanges): void;
  onPass(artefacts: PassArtefacts): void;
};

export type FailedChanges = {
  records?: FailedRecords;
  screenshots: FailedScreenshot[];
};

export type FreshChanges = {
  records?: FreshRecords;
  screenshots: FreshScreenshot[];
};

export type PassArtefacts = {
  records: PassRecords;
  screenshots: PassScreenshot[];
};

export type Changes = {
  records?: ChangedRecords;
  screenshots: ChangedScreenshot[];
};

// TODO: Simplify using predicates on type
// Transforms (refines) StoryRunResult to domain significant entities
export const StoryRunResult = {
  when: Visitor.when<StoryRunResult, Cases>((result, handlers) => {
    const fail: FailedChanges = {
      records: result.records.type === 'fail' ? result.records : undefined,
      screenshots: result.screenshots.filter((it) => it.type === 'fail'),
    };

    if (isDefined(fail.records) || fail.screenshots.length > 0) {
      return handlers.onFail(fail);
    }

    const fresh: FreshChanges = {
      records: result.records.type === 'fresh' ? result.records : undefined,
      screenshots: result.screenshots.filter((it) => it.type === 'fresh'),
    };

    if (isDefined(fresh.records) || fresh.screenshots.length > 0) {
      return handlers.onFresh(fresh);
    }

    return handlers.onPass(result as PassArtefacts);
  }),
  changes(result: StoryRunResult): undefined | Changes {
    const changes: Changes = {
      records: result.records.type !== 'pass' ? result.records : undefined,
      screenshots: result.screenshots.filter((it) => it.type !== 'pass'),
    };

    if (isDefined(changes.records) || changes.screenshots.length > 0) {
      return changes;
    }
  },
};
