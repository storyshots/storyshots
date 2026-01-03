import { PreviewServerFactory } from '@storyshots/core/manager';
import * as preview from './scripts/preview';
import * as build from './scripts/build';

export const createNextPreview = (): PreviewServerFactory => async (mode) => {
  if (mode === 'ci') {
    await build.run();
  }

  const { ready, kill } = preview.run({ dev: mode === 'ui' });

  await ready;

  return {
    at: 'http://localhost:3000',
    cleanup: async () => kill(),
  };
};
