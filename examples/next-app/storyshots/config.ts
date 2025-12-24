import { UserDefinedManagerConfig, RUNNER } from '@storyshots/core/manager';
import { createNextPreview } from '@storyshots/next/preview';
import path from 'node:path';

export const config: UserDefinedManagerConfig = {
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
  },
  preview: createNextPreview(),
  runner: RUNNER.pool({ agentsCount: 4 }),
};
