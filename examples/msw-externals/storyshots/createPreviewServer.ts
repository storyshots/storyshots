import { PreviewServerFactory } from '@storyshots/core/manager';
import { createWebpackPreview } from '@storyshots/webpack';

import config from '../webpack.config';
import path from 'path';

export function createPreviewServer(): PreviewServerFactory {
  config.entry = '/storyshots/preview/index.tsx';

  return createWebpackPreview(path.join(process.cwd(), 'dist'), config);
}
