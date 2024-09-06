import wsify from 'express-ws';
import express from 'express';
import { not } from '@storyshots/core';
import { createPreviewWatcher } from '../compiler/createPreviewWatcher';
import { createCommonApiHandlers } from '../createCommonApiHandlers';
import { ManagerConfig } from '../reusables/types';
import path from 'path';
import { root } from '../compiler/manager-root';

export async function runHeadless(config: ManagerConfig) {
  const manager = express.static(path.join(root, 'lib', 'client'));

  const { app } = wsify(express());

  app.use((request, response, next) => {
    const query = request.method === 'GET' || request.method === 'HEAD';

    if (not(query)) {
      return next();
    }

    if (not('manager' in request.query && request.query.manager === 'SECRET')) {
      return config.preview.handler(request, response, next);
    }

    if (request.path.includes('/api/')) {
      return next();
    }

    const file = request.path.lastIndexOf('.') > request.path.lastIndexOf('/');

    request.url = file ? request.url : '/index.html';

    return manager(request, response, next);
  });

  createPreviewWatcher(app, config.preview);
  const cleanup = await createCommonApiHandlers(app, config);

  const server = app.listen(config.port);

  return {
    app,
    cleanup: () => {
      server.close();
      cleanup();
    },
  };
}
