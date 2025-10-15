/* eslint-disable react/react-in-jsx-scope */
import { describe, test } from '../reusables/test';
import { ActionStep } from '../reusables/test/test-description';
import { devices } from './reusables/device';

describe('devices run complete', () => {
  test(
    'allows to run a story across all devices',
    setup()
      .screenshot()
      .open('Records', 'desktop')
      .screenshot()
      .open('FINAL', 'desktop')
      .screenshot()
      .open('FINAL', 'mobile')
      .screenshot()
      .open('Records', 'mobile')
      .screenshot(),
  );

  test(
    'compares shots between devices independently',
    setup()
      .accept('is a story')
      .preview()
      .story(() => ({
        render: (_, { device, journal }) => {
          journal.record(device.name);

          return device.name === 'desktop' ? device.name : 'broken on mobile';
        },
      }))
      .actor()
      .run('is a story')
      .screenshot()
      .open('FINAL', 'mobile')
      .screenshot(),
  );

  test(
    'compares records between devices independently',
    setup()
      .accept('is a story')
      .preview()
      .story(() => ({
        render: (_, { device, journal }) => {
          journal.record(
            device.name === 'desktop' ? device.name : 'broken on mobile',
          );

          return device.name;
        },
      }))
      .actor()
      .run('is a story')
      .screenshot()
      .open('Records', 'mobile')
      .screenshot(),
  );

  test(
    'displays errors independently',
    devices()
      .story(({ finder }) => ({
        act: (actor, { device }) =>
          device.name === 'desktop'
            ? actor
            : actor.click(finder.getByText('Submit')),
        render: () => (
          <div>
            <button>Submit</button>
            <button>Submit</button>
          </div>
        ),
      }))
      .actor()
      .do(setAllDevicesToRun())
      .run('is a story')
      .screenshot()
      .do((page) => page.getByLabel('Progress').click())
      .screenshot(),
  );

  test(
    'displays results depending on config',
    devices()
      .story(() => ({ render: (_, { device }) => device.name }))
      .actor()
      .run('is a story')
      .screenshot()
      .do(setAllDevicesToRun())
      .screenshot()
      .run('is a story')
      .screenshot()
      .do(selectDeviceToRun(['mobile']))
      .open('FINAL')
      .screenshot(),
  );
});

function setup() {
  return devices()
    .story(() => ({
      render: (_, { device, journal }) => {
        journal.record(device.name);

        return device.name;
      },
    }))
    .actor()
    .do(setAllDevicesToRun())
    .run('is a story');
}

function setAllDevicesToRun(): ActionStep {
  return selectDeviceToRun(['desktop', 'mobile']);
}

function selectDeviceToRun(devices: string[]): ActionStep {
  return async (page) => {
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
  };
}
