import { describe, it } from 'node:test';
import { createTestRunner } from '../node/createTestRunner';
import { createPreviewServer } from './createPreviewServer';
import type { ManagerConfig } from '../node/ManagerConfig';

describe('createTestRunner.getAll', () => {
  it('handles single story from preview', async (t) => {
    const config: ManagerConfig = {
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
      server: createPreviewServer(
        ({ createStoryFactories, createPreviewClientConnection }) =>
          createPreviewClientConnection(
            createStoryFactories().it('single story', {}),
          ),
      ),
    };

    const stories = await createTestRunner(config).getAll();

    t.assert.snapshot(stories);
  });

  it('propagates failure', async (t) => {
    const config: ManagerConfig = {
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
      server: createPreviewServer(
        ({ createStoryFactories, createPreviewClientConnection }) =>
          createPreviewClientConnection(
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
