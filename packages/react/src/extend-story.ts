import { StoryConfig } from '@storyshots/core';
import React from 'react';

declare module '@storyshots/core' {
  interface StoryAttributes<TArg> {
    arrange?(externals: TArg, config: StoryConfig): TArg;

    /**
     * https://storyshots.github.io/storyshots/API/factories/it#render
     */
    render?(externals: TArg, config: StoryConfig): React.ReactNode;
  }
}
