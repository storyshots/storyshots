import { getFromENVByKey } from '../../../neutral/safe-env';
import express, { Request, Response } from 'express';
import { createBindNextToServer } from '../reusables/createBindNextToServer';
import { assert } from '@lib';
import { DefinedActiveStory } from '../../../neutral/types';
import * as story from '../story';
import { createLocker } from '../reusables/createLocker';
import * as fs from 'node:fs';
import * as build from '../build';
import { createHash } from 'node:crypto';

void main();

async function main() {
  const mode = getFromENVByKey('STORYSHOTS_MODE');

  assert(mode?.type === 'preview');

  const app = express();

  app.use(createStoryInstanceHandlers(mode.dev));

  await createBindNextToServer(app, { dev: mode.dev, port: 3000 });

  process.send?.(null);
}

function createStoryInstanceHandlers(dev: boolean) {
  return express
    .Router()
    .get('/__run_story_instance', async (request, response) => {
      assert(typeof request.query['active'] === 'string');

      const active: DefinedActiveStory = JSON.parse(request.query['active']);

      if (!dev) {
        return servePreBuiltStory(active, request, response);
      }

      if (active.env.previewing) {
        return serveWatchStory(active, request, response);
      }

      return serveStaticStory(active, request, response);
    });
}

async function servePreBuiltStory(
  active: DefinedActiveStory,
  request: Request,
  response: Response,
) {
  const { host, kill } = story.run(active, { dev: false });

  request.on('close', kill);

  response.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
  });

  response.flushHeaders();

  response.write(`data: ${await host}\n\n`);
}

const serveWatchStory = (() => {
  let cleanup = () => {};

  return async (active: DefinedActiveStory, _: Request, response: Response) => {
    cleanup();

    const { host, kill } = story.run(active, { dev: true });

    cleanup = kill;

    response.set({
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
    });

    response.flushHeaders();

    response.write(`data: ${await host}\n\n`);
  };
})();

const serveStaticStory = (() => {
  let hash = '';
  const locker = createLocker();

  return async (
    active: DefinedActiveStory,
    request: Request,
    response: Response,
  ) => {
    await locker.lock();

    await bundle();

    locker.unlock();

    const { host, kill } = story.run(active, { dev: false });

    request.on('close', kill);

    response.set({
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
    });

    response.flushHeaders();

    response.write(`data: ${await host}\n\n`);
  };

  async function bundle() {
    const content = fs
      .globSync([
        './.storyshots/.preview/**/*.js',
        './.storyshots/.story/**/*.js',
      ])
      .reduce((hash, path) => {
        const stat = fs.statSync(path);

        return hash.update(`${path}:${stat.size}:${stat.mtimeMs}`);
      }, createHash('sha256'))
      .digest('hex');

    if (content === hash) {
      return;
    }

    await build.run();

    hash = content;
  }
})();
