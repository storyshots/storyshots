import { __bindStoryFactories } from '@storyshots/core';
import { createRun } from './createRun';
import { ExternalsFactory } from './types';

/**
 * https://storyshots.github.io/storyshots/API/createPreviewApp
 */
export function createPreviewApp<TExternals>(
  factory: ExternalsFactory<TExternals>,
) {
  return {
    ...__bindStoryFactories<TExternals>(),
    /**
     * https://storyshots.github.io/storyshots/API/createPreviewApp#run
     */
    run: createRun(factory),
  };
}
