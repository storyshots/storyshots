import { IPreviewServer, PreviewServerFactory } from '@storyshots/core/manager';
import express from 'express';
import { EventEmitter } from 'node:events';
import { Configuration, webpack } from 'webpack';
import _dev from 'webpack-dev-middleware';
import { assert } from '@lib';
import path from 'node:path';

export const createWebpackPreview = (
  root: string,
  config: Configuration,
): PreviewServerFactory => {
  assert(path.isAbsolute(root), 'Path to root must be absolute');

  return (manager) =>
    manager.mode === 'ui'
      ? createWebpackWatchServer(config)
      : createWebpackStaticServer(root, config);
};

function createWebpackWatchServer(config: Configuration): IPreviewServer {
  const compiler = webpack(config);
  const dev = _dev(compiler);

  const emitter = new EventEmitter<{ update: [string] }>();

  compiler.hooks.done.tap('@storyshots/webpack', (stats) =>
    emitter.emit('update', JSON.stringify(stats.toJson())),
  );

  return {
    handler: express
      .Router()
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

async function createWebpackStaticServer(root: string, config: Configuration) {
  return new Promise<IPreviewServer>((resolve, reject) =>
    webpack(config, (error, stats) => {
      if (error) {
        console.error(error.stack || error);

        return reject();
      }

      console.log(stats?.toString({ chunks: false, colors: true }));

      if (stats?.hasErrors()) {
        return reject();
      }

      return resolve({
        handler: express.static(root),
      });
    }),
  );
}
