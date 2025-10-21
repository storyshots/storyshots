import * as esbuild from 'esbuild';
import * as tsup from 'tsup';
import fs from 'node:fs';

void main();

async function main() {
  // core
  await tsup.build({
    entry: {
      index: './src/core/public.ts',
      toolbox: './src/core/toolbox.ts',
      manager: './src/server/index.ts',
    },
    outDir: 'lib',
    platform: 'node',
    target: 'node18',
    format: ['cjs'],
    external: ['esbuild'],
    dts: true,
  });

  // client
  await esbuild.build({
    entryPoints: ['./src/client/index.tsx'],
    outdir: 'lib/client',
    bundle: true,
    platform: 'browser',
    minify: true,
  });

  fs.copyFileSync('src/client/index.html', 'lib/client/index.html');
}
