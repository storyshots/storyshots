import { StoryConfig } from '@storyshots/core';
import { IExternals } from '../../externals/types';

export function createMockExternals(): IExternals {
  return {
    analytics: {
      log: () => {},
    },
  };
}

export function createJournalExternals(
  externals: IExternals,
  { journal }: StoryConfig,
): IExternals {
  return {
    ...externals,
    analytics: {
      ...externals.analytics,
      log: journal.asRecordable('log', externals.analytics.log),
    },
  };
}
