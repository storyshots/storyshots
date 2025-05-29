import { StoryConfig } from '@storyshots/core';

/**
 * https://storyshots.github.io/storyshots/API/createPreviewApp#externalsfactory
 */
export type ExternalsFactory<TExternals> = {
  /**
   * https://storyshots.github.io/storyshots/API/createPreviewApp#createexternals
   */
  createExternals(config: StoryConfig): TExternals;

  /**
   * https://storyshots.github.io/storyshots/API/createPreviewApp#createjournalexternals
   */
  createJournalExternals(
    externals: TExternals,
    config: StoryConfig,
  ): TExternals;
};
