import { build } from 'tsup';

void main();

async function main() {
  await build({
    entry: {
      index: 'src/neutral/index.ts',
    },
    outDir: 'lib',
    platform: 'neutral',
    target: 'node18',
    format: 'cjs',
    dts: true,
  });

  await build({
    entry: {
      client: 'src/client/index.tsx',
    },
    outDir: 'lib',
    platform: 'browser',
    target: 'node18',
    format: 'cjs',
    dts: true,
  });

  await build({
    entry: {
      preview: 'src/preview/index.ts',
      ['scripts/preview']: 'src/preview/scripts/preview/script.ts',
      ['scripts/story']: 'src/preview/scripts/story/script.ts',
      ['scripts/build']: 'src/preview/scripts/build/script.ts',
    },
    outDir: 'lib',
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    dts: true,
  });

  await build({
    entry: {
      stubs: 'src/stubs.ts',
    },
    outDir: 'lib',
    platform: 'neutral',
    target: 'node18',
    format: 'cjs',
    dts: false,
  });
}
