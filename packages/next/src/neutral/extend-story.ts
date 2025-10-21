import { StoryConfig } from '@storyshots/core';

declare module '@storyshots/core' {
  interface StoryAttributes<TArg> {
    arrange?(externals: TArg, config: StoryConfig): TArg;

    at?: string;
  }
}
