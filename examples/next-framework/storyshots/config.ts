import path from 'path';

import { type ManagerConfig, mergeServe } from '@storyshots/core/manager';
import { createWorkerSupplier } from '@storyshots/msw-externals/createWorkerSupplier';

import { createPreviewServer } from './createPreviewServer';

const createConfig = async (): Promise<ManagerConfig> => ({
  devices: [
    {
      name: 'desktop',
      width: 1480,
      height: 920,
    },
  ],
  paths: {
    screenshots: path.join(process.cwd(), 'screenshots'),
    records: path.join(process.cwd(), 'records'),
    temp: path.join(process.cwd(), 'temp'),
  },
  preview: mergeServe(createWorkerSupplier(), await createPreviewServer()),
});

export default createConfig;
