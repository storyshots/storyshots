import { Router } from 'express';
import { ManagerConfig } from '../types';
import { createAcceptRecordsHandler } from './createAcceptRecordsHandler';
import { createAcceptScreenshotHandler } from './createAcceptScreenshotHandler';
import { createActServerSideHandler } from './createActServerSideHandler';
import { createImagePathHandler } from './createImagePathHandler';
import { createBaseline } from './reusables/baseline';

export async function attachApiHandlers(router: Router, config: ManagerConfig) {
  const baseline = await createBaseline(config);

  createAcceptScreenshotHandler(router, baseline);
  createAcceptRecordsHandler(router, baseline);
  createImagePathHandler(router);

  return createActServerSideHandler(router, baseline, config);
}
