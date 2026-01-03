import { IPreviewServer, PreviewServerFactory } from '@storyshots/core/manager';
import { spawn, spawnSync } from 'node:child_process';
import { assertNotEmpty, wait } from '@lib';
import treeKill from 'tree-kill';
import express, { RequestHandler } from 'express';
import * as path from 'node:path';

type Config = {
  ui: {
    command: string;
    at: string;
  };
  ci: {
    command: string;
    serve: string | string[] | RequestHandler;
  };
};

/**
 * https://storyshots.github.io/storyshots/modules/proxy#createproxyserver
 */
export function createExecPreview(config: Config): PreviewServerFactory {
  return (mode) =>
    mode === 'ui'
      ? createUIPreviewServer(config)
      : createStaticPreviewServer(config);
}

async function createUIPreviewServer(config: Config): Promise<IPreviewServer> {
  const child = spawn(config.ui.command, {
    env: {
      ...process.env,
      STORYSHOTS: 'true',
    },
    stdio: 'inherit',
    shell: true,
  });

  const pid = child.pid;

  assertNotEmpty(pid);

  await waitUntilAvailable(config.ui.at);

  return {
    at: config.ui.at,
    cleanup: () =>
      new Promise<void>((resolve, reject) =>
        treeKill(pid, (error) => (error ? reject(error) : resolve())),
      ),
  };
}

function createStaticPreviewServer(config: Config): IPreviewServer {
  spawnSync(config.ci.command, {
    env: {
      ...process.env,
      STORYSHOTS: 'true',
    },
    stdio: 'inherit',
    shell: true,
  });

  const app = express();

  app.use(createFileServeHandler(config));

  const listening = app.listen(3000);

  return {
    at: 'http://localhost:3000',
    cleanup: async () => listening.close(),
  };
}

function createFileServeHandler(config: Config) {
  const { serve } = config.ci;

  if (typeof serve === 'string') {
    return express.static(path.join(process.cwd(), serve));
  }

  if (Array.isArray(serve)) {
    return serve.map((location) =>
      express.static(path.join(process.cwd(), location)),
    );
  }

  return serve;
}

async function waitUntilAvailable(at: string) {
  let ready = false;

  while (!ready) {
    await wait(100);

    try {
      const response = await fetch(at);

      ready = response.ok;
    } catch (_) {}
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STORYSHOTS?: 'true';
    }
  }
}
