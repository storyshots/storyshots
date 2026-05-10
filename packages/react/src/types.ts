import { StoryConfig } from '@storyshots/core';

/**
 * https://storyshots.github.io/storyshots/modules/react#externalsfactory
 */
export type ExternalsFactory<TExternals> = {
  /**
   * https://storyshots.github.io/storyshots/modules/react#createexternals
   */
  createExternals(config: StoryConfig): TExternals;

  /**
   * https://storyshots.github.io/storyshots/modules/react#createjournalexternals
   */
  createJournalExternals(
    externals: TExternals,
    config: StoryConfig,
  ): TExternals;
};
