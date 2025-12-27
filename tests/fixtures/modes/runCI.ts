import { TF } from '../tf';
import {
  runCI as _runCI,
  UserDefinedManagerConfig,
} from '@storyshots/core/manager';
import path from 'path';
import { createWebpackPreviewServer } from './createWebpackPreviewServer';

export async function runCI(
  tf: TF,
  devices: UserDefinedManagerConfig['devices'],
) {
  return _runCI({
    devices,
    paths: {
      screenshots: path.join(process.cwd(), 'screenshots'),
      records: path.join(process.cwd(), 'records'),
    },
    preview: await createWebpackPreviewServer(tf),
  });
}
