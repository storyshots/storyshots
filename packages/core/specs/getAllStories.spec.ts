import { describe, it } from 'node:test';
import { getAllStories } from '../src/node/getAllStories';
import { Journal } from '../src/neutral/Journal';
import { createTestableStoryshotsConfig } from './utils/createTestableStoryshotsConfig';

describe('getAllStories retrieves stories from app client', () => {
  it('handles single it node', async (t) => {
    const config = createTestableStoryshotsConfig(
      ({ createStoryFactories, createNativeAppArgsConnectRunner }) => {
        const { it } = createStoryFactories();

        return createNativeAppArgsConnectRunner(
          it('single story', {}),
          async () => Journal.create(null),
        );
      },
    );

    const stories = await getAllStories(config);

    t.assert.snapshot(stories);
  });

  it('handles it node wrapped in describe', async (t) => {
    const config = createTestableStoryshotsConfig(
      ({ createStoryFactories, createNativeAppArgsConnectRunner }) => {
        const { it, describe } = createStoryFactories();

        return createNativeAppArgsConnectRunner(
          describe('auth', it('logins successfully', {})),
          async () => Journal.create(null),
        );
      },
    );

    const stories = await getAllStories(config);

    t.assert.snapshot(stories);
  });

  it('handles it node wrapped in describe wrapped in describe', async (t) => {
    const config = createTestableStoryshotsConfig(
      ({ createStoryFactories, createNativeAppArgsConnectRunner }) => {
        const { it, describe } = createStoryFactories();

        return createNativeAppArgsConnectRunner(
          describe(
            'auth',
            describe('login form', it('shows submit button', {})),
          ),
          async () => Journal.create(null),
        );
      },
    );

    const stories = await getAllStories(config);

    t.assert.snapshot(stories);
  });

  it('propagates failure', async (t) => {
    const config = createTestableStoryshotsConfig(
      ({ createStoryFactories, createNativeAppArgsConnectRunner }) => {
        const { it } = createStoryFactories();

        return createNativeAppArgsConnectRunner(
          it('single failed story', {
            act() {
              throw { message: 'SOMETHING_WENT_WRONG' };
            },
          }),
          async () => Journal.create(null),
        );
      },
    );

    const stories = await getAllStories(config);

    t.assert.snapshot(stories);
  });
});
