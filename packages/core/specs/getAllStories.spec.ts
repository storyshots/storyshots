import { describe, it } from 'node:test';
import { createTestRunner } from '../src/node/createTestRunner';
import { createPreviewServer } from './utils/createPreviewServer';
import type { RunnerConfig } from '../src/node/RunnerConfig';

describe('stories retrieval process', () => {
  it('handles single story from preview', async (t) => {
    const config: RunnerConfig = {
      paths: {
        records: 'records',
        screenshots: 'screenshots',
      },
      devices: [
        {
          name: 'desktop',
          width: 1280,
          height: 720,
        },
      ],
      createServer: createPreviewServer(
        ({ createStoryFactories, createNativeAppArgsConnectRunner }) =>
          createNativeAppArgsConnectRunner(
            createStoryFactories().it('single story', {}),
          ),
      ),
    };

    const stories = await createTestRunner(config).getAll();

    t.assert.snapshot(stories);
  });

  it('propagates failure', async (t) => {
    const config: RunnerConfig = {
      paths: {
        records: 'records',
        screenshots: 'screenshots',
      },
      devices: [
        {
          name: 'desktop',
          width: 1280,
          height: 720,
        },
      ],
      createServer: createPreviewServer(
        ({ createStoryFactories, createNativeAppArgsConnectRunner }) =>
          createNativeAppArgsConnectRunner(
            createStoryFactories().it('single failed story', {
              act() {
                throw { message: 'SOMETHING_WENT_WRONG' };
              },
            }),
          ),
      ),
    };

    const stories = await createTestRunner(config).getAll();

    t.assert.snapshot(stories);
  });
});
