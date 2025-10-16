import { IPreviewServer } from '@storyshots/core/manager';
import { createWebpackWatchServer } from '@storyshots/webpack';

import config from '../webpack.config';

export function createPreviewServer(): IPreviewServer {
  config.entry = '/storyshots/preview/index.tsx';

  return createWebpackWatchServer(config);
}
