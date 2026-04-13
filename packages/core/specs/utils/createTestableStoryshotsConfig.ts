import express from 'express';
import { build } from 'esbuild';
import { Server } from 'node:http';
import * as browser from '../../src/browser/public';
import * as neutral from '../../src/neutral/public';
import { StoryshotsConfig } from '../../src/node/StoryshotsConfig';

type Main = (context: typeof browser & typeof neutral) => void;

export function createTestableStoryshotsConfig(client: Main) {
  return {
    paths: {
      journal: 'journal',
      screenshots: 'screenshots',
    },
    devices: [
      {
        name: 'desktop',
        width: 1280,
        height: 720,
      },
    ],
    createServer: createInMemoryAppServer(client),
  };
}

/**
 * Create in-memory app server that serves a client implemented by `client` arg.
 *
 * Used for testing purposes only.
 *
 * @param client App client implementation running in browser
 */
const createInMemoryAppServer =
  (client: Main): StoryshotsConfig['createServer'] =>
  async () => {
    const bundle = await createBundle(client);
    const app = express();

    app.get('/', (_, res) => res.send(createPage()));
    app.get('/client.bundle.js', (_, res) => {
      res.type('application/javascript; charset=utf-8');
      res.send(Buffer.from(bundle));
    });

    const server = await listen(app, 3000);

    return {
      at: 'http://localhost:3000',
      [Symbol.asyncDispose]: () => close(server),
    };
  };

async function createBundle(main: Main): Promise<Uint8Array> {
  const result = await build({
    stdin: {
      contents: createAppClientSourceCode(main),
      sourcefile: 'client.entry.js',
      loader: 'js',
      resolveDir: process.cwd(),
    },
    outfile: 'client.bundle.js',
    bundle: true,
    platform: 'browser',
    format: 'iife',
    splitting: false,
    sourcemap: false,
    write: false,
  });

  const bundle = result.outputFiles.find((file) => file.path.endsWith('.js'));

  if (!bundle) {
    throw new Error('esbuild did not produce JavaScript output');
  }

  return bundle.contents;
}

function createPage(): string {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Client</title>
  </head>
  <body>
    <script src="/client.bundle.js"></script>
  </body>
</html>`;
}

function createAppClientSourceCode(main: Main): string {
  return `
import * as neutral from '@storyshots/core';
import * as browser from '@storyshots/core/browser';

const context = { ...neutral, ...browser };

((${main.toString()})(context));
`;
}

function listen(app: express.Express, port: number): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve(server));

    server.once('error', reject);
  });
}

function close(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
}

