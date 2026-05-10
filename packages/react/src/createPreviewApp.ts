import { createBindStoryFactories } from '@storyshots/core/devkit';
import { createRun } from './createRun';
import { ExternalsFactory } from './types';

/**
 * https://storyshots.github.io/storyshots/modules/react
 */
export function createPreviewApp<TExternals>(
  factory: ExternalsFactory<TExternals>,
) {
  return {
    ...createBindStoryFactories<TExternals>(),
    /**
     * https://storyshots.github.io/storyshots/modules/react#run
     */
    run: createRun(factory),
  };
}
