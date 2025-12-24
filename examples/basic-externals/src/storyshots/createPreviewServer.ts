import { PreviewServerFactory } from '@storyshots/core/manager';
import { createWebpackPreview } from '@storyshots/webpack';
import path from 'path';
import config from '../../webpack.config';

export function createPreviewServer(): PreviewServerFactory {
  config.entry = [
    '@storyshots/webpack/client',
    path.join(__dirname, 'preview', 'index.tsx'),
  ];

  return createWebpackPreview(path.join(process.cwd(), 'dist'), config);
}
