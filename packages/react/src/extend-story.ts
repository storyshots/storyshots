import { StoryConfig } from '@storyshots/core';
import React from 'react';

declare module '@storyshots/core' {
  interface StoryAttributes<TExternals> {
    /**
     * https://storyshots.github.io/storyshots/API/factories/it#render
     */
    render?(externals: TExternals, config: StoryConfig): React.ReactNode;
  }
}
