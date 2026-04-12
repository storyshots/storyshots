import express from 'express';
import { build } from 'esbuild';
import { Server } from 'node:http';
import * as browser from '../../src/browser/public';
import * as neutral from '../../src/neutral/public';
import { RunnerConfig } from '../../src/node/RunnerConfig';

type Main = (context: typeof browser & typeof neutral) => void;

/**
 * Create in-memory preview server that serves a client implemented by `main` arg.
 *
 * Used for testing purposes only.
 *
 * @param main Preview client implementation
 */
export const createPreviewServer =
  (main: Main): RunnerConfig['createServer'] =>
  async () => {
    const bundle = await createBundle(main);
    const app = express();

    app.get('/', (_, res) => res.send(createPage()));
    app.get('/preview.bundle.js', (_, res) => {
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
      contents: createPreviewServerSourceCode(main),
      sourcefile: 'preview.entry.js',
      loader: 'js',
      resolveDir: process.cwd(),
    },
    outfile: 'preview.bundle.js',
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
    <title>Preview</title>
  </head>
  <body>
    <script src="/preview.bundle.js"></script>
  </body>
</html>`;
}

function createPreviewServerSourceCode(main: Main): string {
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
