import { createBindStoryFactories } from '@storyshots/core/devkit';
import { ExternalsFactory } from './types';
import { createStoryView } from './App';
import { StoryTree } from '@storyshots/core';
import ReactDOM from 'react-dom';
import { createRootElement } from './createRootElement';

import './extend-story';

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
    run: (stories: StoryTree<TExternals>) =>
      render(createStoryView(stories, factory)),
  };
}

function render(view: ReturnType<typeof createStoryView>) {
  if (view === undefined) {
    return;
  }

  return ReactDOM.render(view, createRootElement());
}
