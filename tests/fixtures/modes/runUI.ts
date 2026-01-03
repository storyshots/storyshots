import { Implementation, TF } from '../tf';
import { UserDefinedManagerConfig } from '@storyshots/core/manager';
import path from 'path';
import { createWebpackPreviewServer } from './createWebpackPreviewServer';
import { createStoryshotsServer } from '@storyshots/core/devkit/manager';
import { expect, Page, test } from '@playwright/test';
import { wait } from '@lib';

export async function runUI(
  tf: TF,
  page: Page,
  devices: UserDefinedManagerConfig['devices'],
) {
  const storyshots = await createStoryshotsServer({
    devices,
    paths: {
      screenshots: path.join(process.cwd(), 'screenshots'),
      records: path.join(process.cwd(), 'records'),
    },
    preview: await createWebpackPreviewServer(tf),
  });

  await page.route('http://localhost:6006/api/client/act', (route) =>
    route.fulfill({ status: 200, json: { type: 'success' } }),
  );

  await page.goto(storyshots.root.href);

  return {
    ui: {
      ...createActor(page),
      change: (impl: Implementation) =>
        test.step('Making a change', () => {
          tf.change(impl);

          const updated = new Promise<void>((resolve) =>
            page.route('http://localhost:3000', (route) => {
              resolve();

              return route.continue();
            }),
          );

          return updated.then(() => page.waitForLoadState('networkidle'));
        }),
    },
    cleanup: storyshots.cleanup,
  };
}

function createActor(page: Page) {
  return {
    open: (title: string, under?: string) =>
      test.step('Opening an entry', async () => {
        await (under
          ? page.getByLabel(under).getByText(title).click()
          : page.getByText(title).click());

        return Promise.race([
          page.waitForLoadState('networkidle'),
          wait(1_000),
        ]);
      }),
    accept: async (title: string) =>
      test.step('Accepting a story', async () => {
        await page.getByText(title, { exact: true }).hover();

        await page.getByRole('button', { name: 'Accept all' }).click();
      }),
    run: async (title: string) =>
      test.step('Running a story', async () => {
        await page.getByText(title, { exact: true }).hover();

        await page.getByLabel(title).getByLabel('Run', { exact: true }).click();

        await page
          .getByLabel('Status')
          .getByRole('button', { name: 'Run' })
          .waitFor({ state: 'visible' });
      }),
    screenshot: async () =>
      test.step('Making screenshot', async () => {
        for (const duration of await page.getByLabel('Run duration').all()) {
          await duration.evaluate((element) => (element.innerHTML = '1s'));
        }

        await expect(page).toHaveScreenshot();
      }),
  };
}
