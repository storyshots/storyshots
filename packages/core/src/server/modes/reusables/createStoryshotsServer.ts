import express, { Router } from 'express';
import { regexpJSONReviver } from '../../../reusables/regexpJSON';
import { createUIHandler } from '../../createUIHandler';
import { attachApiHandlers } from '../../handlers';
import {
  IPreviewServer,
  ManagerConfig,
  UserDefinedManagerConfig,
} from '../../types';
import { COMPARE } from '../../modules/compare';
import { CAPTURE } from '../../modules/capture';
import { RUNNER } from '../../modules/runner';
import { Device } from '@core';
import { createManagerRootURL } from '../../paths';

type PreviewReadyManagerConfig = UserDefinedManagerConfig & {
  preview: IPreviewServer;
};

export async function createStoryshotsServer(
  _config: PreviewReadyManagerConfig,
) {
  const config = createManagerConfig(_config);

  const app = express();
  const router = Router();

  const cleanup = await attachApiHandlers(router, config);

  app.use(express.json({ reviver: regexpJSONReviver }));
  app.use(router);
  app.use(createUIHandler());

  const listening = app.listen(6006);

  return {
    root: createManagerRootURL(config),
    config,
    router,
    cleanup: async () => {
      await config.preview.cleanup();

      await cleanup();

      listening.close();
    },
  };
}

export type StoryshotsServer = Awaited<
  ReturnType<typeof createStoryshotsServer>
>;

function createManagerConfig(config: PreviewReadyManagerConfig): ManagerConfig {
  return {
    preview: config.preview,
    compare: config.compare ?? COMPARE.withPlaywright(),
    capture:
      config.capture ??
      CAPTURE.stabilized({
        attempts: 5,
        interval: (attempt) => 100 * Math.pow(2, attempt),
      }),
    runner: config.runner ?? RUNNER.pool({ agentsCount: 1 }),
    paths: config.paths,
    devices: config.devices as Device[],
  };
}
