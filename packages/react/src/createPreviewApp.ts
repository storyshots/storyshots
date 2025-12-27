import { createBindStoryFactories } from '@storyshots/core/devkit';
import { createRun } from './createRun';
import { ExternalsFactory } from './types';

/**
 * https://storyshots.github.io/storyshots/API/createPreviewApp
 */
export function createPreviewApp<TExternals>(
  factory: ExternalsFactory<TExternals>,
) {
  return {
    ...createBindStoryFactories<TExternals>(),
    /**
     * https://storyshots.github.io/storyshots/API/createPreviewApp#run
     */
    run: createRun(factory),
  };
}
