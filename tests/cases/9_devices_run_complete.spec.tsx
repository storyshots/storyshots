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

test('allows to run a story across all devices', async ({
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
        render: (_, { device, journal }) => {
          journal.record(device.name);

          return <h1>{device.name}</h1>;
        },
      }),
    );
  });

  await setAllDevicesToRun(page);

  await ui.run('is a story');

  await ui.screenshot();

  await ui.open('Records', 'desktop');

  await ui.screenshot();

  await ui.open('FINAL', 'desktop');

  await ui.screenshot();

  await ui.open('Records', 'mobile');

  await ui.screenshot();

  await ui.open('FINAL', 'mobile');

  await ui.screenshot();

  await ui.accept('is a story');

  await ui.screenshot();
});

test('compares baseline between devices independently', async ({
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
        render: (_, { device, journal }) => {
          journal.record(device.name);

          return <h1>{device.name}</h1>;
        },
      }),
    );
  });

  await setAllDevicesToRun(page);

  await ui.run('is a story');
  await ui.accept('is a story');

  await ui.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        render: (_, { device, journal }) => {
          if (device.name === 'desktop') {
            journal.record(device.name);
          }

          return device.name === 'desktop' ? (
            <h1>{device.name}</h1>
          ) : (
            'broken on mobile'
          );
        },
      }),
    );
  });

  await ui.run('is a story');

  await ui.screenshot();

  await ui.open('Records', 'mobile');

  await ui.screenshot();

  await ui.open('FINAL', 'mobile');

  await ui.screenshot();
});

test('displays errors independently', async ({ ui, page }) => {
  await ui.change(({ createPreviewApp, finder }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        act: (actor) => actor.click(finder.getByText('Click me')),
        render: (_, { device }) =>
          device.name === 'desktop' ? (
            <button>Click me</button>
          ) : (
            <>
              <button>Click me</button>
              <button>Click me</button>
            </>
          ),
      }),
    );
  });

  await setAllDevicesToRun(page);

  await ui.run('is a story');

  await ui.screenshot();

  await page.getByLabel('Progress').click();

  await ui.screenshot();
});

test('displays results depending on config', async ({ ui, page }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        render: (_, { device, journal }) => {
          journal.record(device.name);

          return <h1>{device.name}</h1>;
        },
      }),
    );
  });

  await ui.run('is a story');

  await ui.screenshot();

  await setAllDevicesToRun(page);

  await ui.screenshot();

  await ui.run('is a story');

  await ui.screenshot();

  await selectDeviceToRun(['mobile'], page);

  await ui.open('FINAL');

  await ui.screenshot();
});

function setAllDevicesToRun(page: Page) {
  return selectDeviceToRun(['desktop', 'mobile'], page);
}

async function selectDeviceToRun(devices: string[], page: Page) {
  await page.getByLabel('Toggle config pane').click();

  const input = page.getByLabel('Devices to run');

  await input.hover();

  const clear = page.getByLabel('close-circle');

  if (await clear.isVisible()) {
    await clear.click();
  }

  await input.click();

  for (const device of devices) {
    await page.getByTitle(device).click();
  }

  await page.getByLabel('Toggle config pane').click();
}
