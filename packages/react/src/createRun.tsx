import { StoryTree } from '@storyshots/core';
import { createRoot } from 'react-dom/client';
import { createStoryView } from './App';
import { ExternalsFactory } from './types';

export const createRun =
  <TExternals extends unknown>(factory: ExternalsFactory<TExternals>) =>
  async (stories: StoryTree<TExternals>) =>
    createRoot(createRootElement()).render(createStoryView(stories, factory));

function createRootElement(): Element {
  const found = document.querySelector('#root');

  if (found) {
    return found;
  }

  const div = document.createElement('div');

  div.setAttribute('id', 'root');

  document.body.appendChild(div);

  return div;
}
