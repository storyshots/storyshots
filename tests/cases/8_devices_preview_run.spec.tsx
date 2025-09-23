import { describe, test } from '../reusables/test';
import { ActionStep } from '../reusables/test/test-description';
import { devices } from './reusables/device';

describe('devices preview run', () => {
  test(
    'uses first defined device by default for preview',
    setup().open('is a story').screenshot(),
  );

  test(
    'uses first defined device by default for run',
    setup().run('is a story').open('FINAL').screenshot(),
  );

  test(
    'allows set default device for run',
    setup()
      .do(selectRunOnMobileDevice())
      .run('is a story')
      .open('FINAL')
      .screenshot(),
  );

  test(
    'allows set default device for preview',
    setup().do(selectPreviewOnMobileDevice()).open('is a story').screenshot(),
  );

  test(
    'does not set default device for preview when not emulating',
    setup().do(selectRunOnMobileDevice()).open('is a story').screenshot(),
  );
});

function setup() {
  return devices()
    .story(() => ({ render: (_, { device }) => device.name }))
    .actor();
}

function selectRunOnMobileDevice(): ActionStep {
  return async (page) => {
    await page.getByLabel('Toggle config pane').click();

    await page.getByLabel('Devices to run').click();

    await page.getByTitle('mobile').click();
  };
}

function selectPreviewOnMobileDevice(): ActionStep {
  return async (page) => {
    await page.getByLabel('Toggle config pane').click();

    await page.getByLabel('Device to emulate').click();

    await page.getByTitle('mobile').click();
  };
}
