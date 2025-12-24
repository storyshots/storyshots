import { getFromENVByKey } from '../../../neutral/safe-env';
import express from 'express';
import { createBindNextToServer } from '../reusables/createBindNextToServer';
import { StoryStorageBody } from '../../../neutral/shared-state';
import { assert } from '@lib';
import { createLocker } from '../reusables/createLocker';

void main();

async function main() {
  const mode = getFromENVByKey('STORYSHOTS_MODE');

  assert(mode?.type === 'story');

  const app = express();

  app.use(createStoryStoreHandlers());

  const host = await createBindNextToServer(
    app,
    mode.dev ? { dev: true, port: 3010 } : { dev: false },
  );

  process.send?.(host);
}

function createStoryStoreHandlers() {
  const store: Record<string, unknown> = {};
  const locker = createLocker();

  return express
    .Router()
    .use('/__story_storage', express.json())
    .post('/__story_storage', async (request, response) => {
      const body = request.body as StoryStorageBody;

      if (body.action === 'get') {
        return response.json(store[body.payload.key]);
      }

      if (body.action === 'start-update') {
        await locker.lock();

        return response.end();
      }

      store[body.payload.key] = body.payload.value;

      locker.unlock();

      return response.end();
    });
}
