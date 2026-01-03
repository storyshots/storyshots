import { test } from '../fixtures/ui';
import { Page } from '@playwright/test';

test.use({
  devices: [
    [
      {
        name: 'desktop',
        width: 1480,
        height: 920,
      },
      {
        name: 'mobile',
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        width: 414,
        height: 896,
      },
    ],
    { scope: 'test' },
  ],
});

test('uses first defined device by default for preview and run', async ({
  ui,
}) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        render: (_, { device }) => <h1>{device.name}</h1>,
      }),
    );
  });

  await ui.open('is a story');

  await ui.screenshot();

  await ui.run('is a story');
  await ui.open('FINAL');

  await ui.screenshot();
});

test('allows set default device for run but not for preview', async ({
  ui,
  page,
}) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        render: (_, { device }) => <h1>{device.name}</h1>,
      }),
    );
  });

  await selectRunOnMobileDevice(page);

  await ui.open('is a story');

  await ui.screenshot();

  await ui.run('is a story');
  await ui.open('FINAL');

  await ui.screenshot();
});

test('allows set default device for preview', async ({ ui, page }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        render: (_, { device }) => <h1>{device.name}</h1>,
      }),
    );
  });

  await selectPreviewOnMobileDevice(page);

  await ui.open('is a story');

  await ui.screenshot();
});

async function selectRunOnMobileDevice(page: Page) {
  await page.getByLabel('Toggle config pane').click();

  await page.getByLabel('Devices to run').click();

  await page.getByTitle('mobile').click();
}

async function selectPreviewOnMobileDevice(page: Page) {
  await page.getByLabel('Toggle config pane').click();

  await page.getByLabel('Device to emulate').click();

  await page.getByTitle('mobile').click();
}
