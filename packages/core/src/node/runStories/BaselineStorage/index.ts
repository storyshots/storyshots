import { Journal } from '../../../neutral/Journal';
import { Screenshot } from '../../../neutral/screenshot/Screenshot';
import { JournalExpectedBaseline } from './JournalExpectedBaseline';
import { ScreenshotsExpectedBaseline } from './ScreenshotsExpectedBaseline';

/**
 * Reads and updates persisted baseline (consisting of screenshots and journal records)
 */
export const ExpectedBaseline = {
  create: async (): Promise<ExpectedBaseline> => ({
    journal: await JournalExpectedBaseline.read(),
    screenshots: await ScreenshotsExpectedBaseline.read(),
  }),
  update: async (changes: ExpectedBaseline): Promise<void> => {
    if (changes.journal) {
      await JournalExpectedBaseline.accept(changes.journal);
    }

    await ScreenshotsExpectedBaseline.accept(changes.screenshots);
  },
};

export type ExpectedBaseline = {
  journal: Journal | undefined;
  screenshots: Screenshot[];
};
