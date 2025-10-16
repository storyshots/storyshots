import { IPreviewServer } from '@storyshots/core/manager';
import { createWebpackWatchServer } from '@storyshots/webpack';
import path from 'path';
import config from '../../webpack.config';

export function createPreviewServer(): IPreviewServer {
  config.entry = ['@storyshots/webpack/client', path.join(__dirname, 'preview', 'index.tsx')];

  return createWebpackWatchServer(config);
}
