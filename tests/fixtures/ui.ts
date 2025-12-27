import { UserDefinedManagerConfig } from '@storyshots/core/manager';
import { test as _test } from './tf';
import { runUI } from './modes';

type UIFixture = Awaited<ReturnType<typeof runUI>>['ui'];

export const test = _test.extend<{
  devices: UserDefinedManagerConfig['devices'];
  ui: UIFixture;
}>({
  devices: [
    [
      {
        name: 'desktop',
        width: 1480,
        height: 920,
      },
    ],
    { option: true },
  ],

  ui: async ({ tf, page, devices }, use) => {
    const storyshots = await runUI(tf, page, devices);

    await use(storyshots.ui);

    await storyshots.cleanup();
  },
});
