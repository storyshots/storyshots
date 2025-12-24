import { JournalRecord } from '@storyshots/core/toolbox';
import { createSharedState } from './shared-state';
import { StoryConfig } from '@storyshots/core';

type DatedJournalRecord = JournalRecord & { at: number };

export function createSharedJournal(): StoryConfig['journal'] {
  const records = exposeAndGetJournalState();

  const journal: StoryConfig['journal'] = {
    asRecordable: (method, fn) =>
      (async (...args) => {
        await journal.record(method, ...args);

        return fn(...args);
        /*
         This conversion is misleading and can cause errors when trying to record synchronous functions
         as it will make execution of them async (change result and delay execution).

         This is not a bug due to the absence of an ability to record sync function executions in next.js app (for now).
        */
      }) as typeof fn,
    record: async (method, ...args) => {
      const at = +new Date();

      return records.update((records) => [
        ...records,
        {
          at,
          method,
          args,
        },
      ]);
    },
  };

  return journal;
}

export function exposeAndGetJournalState() {
  const records = createSharedState<DatedJournalRecord[]>(
    'storyshots_journal',
    [],
  );

  // Expose journal records globally
  const context = globalThis as typeof window;
  context.getJournalRecords = async () => {
    return (await records.get())
      .sort((a, b) => a.at - b.at)
      .map((record) => ({
        method: record.method,
        args: record.args,
      }));
  };

  return records;
}
