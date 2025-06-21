import { IPreviewServer } from '@storyshots/core/manager';
import { Router } from 'express';
import { EventEmitter } from 'node:events';
import { Configuration, webpack } from 'webpack';
import _dev from 'webpack-dev-middleware';

/**
 * https://storyshots.github.io/storyshots/modules/webpack#createwebpackserver
 */
export function createWebpackServer(config: Configuration): IPreviewServer {
  const compiler = webpack(config);
  const dev = _dev(compiler);

  const emitter = new EventEmitter<{ update: [string] }>();

  compiler.hooks.done.tap('@storyshots/webpack', (stats) =>
    emitter.emit('update', JSON.stringify(stats.toJson())),
  );

  return {
    handler: Router()
      .get('/__live_reload', (_, response) => {
        response.set({
          'Cache-Control': 'no-cache',
          'Content-Type': 'text/event-stream',
          Connection: 'keep-alive',
        });

        response.flushHeaders();

        const listener = (stats: string) =>
          response.write(`data: ${stats}\n\n`);

        emitter.on('update', listener);
        response.on('close', () => emitter.off('update', listener));
      })
      .all('*', dev),
    cleanup: () =>
      new Promise<void>((resolve, reject) => {
        emitter.removeAllListeners();
        
        dev.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}
