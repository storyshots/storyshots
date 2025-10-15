import { ManagerConfig } from '@packages/core/src/server';
import { runInBackground } from '@packages/core/src/server/modes/runInBackground';
import { createManagerConfig } from './createManagerConfig';
import { createPreview, Preview } from './preview';
import { defineManagerStep } from './test/test-description';

export type Background = {
  devices(devices: ManagerConfig['devices']): Background;
  preview(): Preview<unknown>;
};

function createBackground(devices: ManagerConfig['devices']): Background {
  return {
    devices: (devices) => createBackground(devices),
    preview: () =>
      createPreview(
        defineManagerStep(async (_, tf) => {
          const bg = await runInBackground(createManagerConfig(devices, tf));

          return {
            run: async () => {
              const result = await bg.run();

              if (result === 'fail') {
                throw new Error('Failed');
              }
            },
            cleanup: () => bg.cleanup(),
          };
        }),
      ),
  };
}

export const background = createBackground([]);
