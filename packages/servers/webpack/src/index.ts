import { IPreviewServer } from '@storyshots/core/manager';
import { Configuration, webpack } from 'webpack';
import _dev from 'webpack-dev-middleware';
import _hot from 'webpack-hot-middleware';

/**
 * https://storyshots.github.io/storyshots/modules/webpack#createwebpackserver
 */
export function createWebpackServer(config: Configuration): IPreviewServer {
  const compiler = webpack(config);

  const dev = _dev(compiler);
  const hot = _hot(compiler);

  return {
    handler: (req, res, next) => dev(req, res, () => hot(req, res, next)),
    cleanup: () =>
      new Promise<void>((resolve, reject) => {
        dev.close((error) => (error ? reject(error) : resolve()));
        hot.close();
      }),
  };
}
