import { Stream } from '@storyshots/utils';
import { StoryshotsConfig } from '../StoryshotsConfig';
import { Browser, Page } from 'playwright';
import { Pool } from 'tarn';
import { chromium } from 'playwright-core';
import { Device } from '../../neutral/story/config';

export type Cluster = AsyncDisposable & {
  /**
   * Schedules jobs on playwright agents pool.
   */
  schedule<TArg extends { device: Device }, TEmit>(
    stories: TArg[],
    options: {
      signal: AbortSignal;
      handle(story: TArg, page: Page): Stream<TEmit, void>;
    },
  ): Stream<TEmit, void>;
};

export const Cluster = {
  create: (agentsCount: StoryshotsConfig['agentsCount']): Cluster => {
    const browsers = createBrowsersPool(agentsCount);

    return {
      schedule: (stories, options) => {
        return Stream.all(
          stories.map(async function* (story) {
            using resource = await browsers.acquire();
            options.signal.throwIfAborted();

            const config = {
              viewport: {
                width: story.device.width,
                height: story.device.height,
              },
              userAgent: story.device.userAgent,
            };

            await using context = await resource.browser.newContext(config);
            options.signal.throwIfAborted();

            context.setDefaultTimeout(10_000);

            await using page = await context.newPage();
            options.signal.throwIfAborted();

            yield* options.handle(story, page);
          }),
        );
      },
      [Symbol.asyncDispose]: () => browsers[Symbol.asyncDispose](),
    };
  },
};

function createBrowsersPool(agentsCount: StoryshotsConfig['agentsCount']) {
  const count = Math.max(agentsCount ?? 1, 1);

  const pool = new Pool<Browser>({
    create: () =>
      chromium.launch({
        args: ['--disable-web-security'],
      }),
    destroy: (browser) => browser.close(),
    min: 1,
    max: count,
  });

  return {
    acquire: async () => {
      const browser = await pool.acquire().promise;

      return {
        browser,
        [Symbol.dispose]: () => pool.release(browser),
      };
    },
    [Symbol.asyncDispose]: async () => {
      // It is import to await this way so that Promise return is void
      await pool.destroy();
    },
  };
}

