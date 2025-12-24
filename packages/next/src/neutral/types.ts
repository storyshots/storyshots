import { StoryConfig } from '@storyshots/core';
import { ToJSONLike } from '@lib';

export type ExternalsFactory<TExternals> = {
  createExternals(config: StoryConfig): TExternals;
  createJournalExternals(
    externals: TExternals,
    config: StoryConfig,
  ): TExternals;
};

export type DefinedActiveStory = ToJSONLike<
  NonNullable<ReturnType<typeof window.onPreviewReady>>
>;
