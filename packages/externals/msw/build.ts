import { build } from 'tsup';

void main();

async function main() {
  await build({
    entry: ['src/index.ts'],
    outDir: 'lib',
    platform: 'neutral',
    target: 'node18',
    format: 'cjs',
    dts: true,
  });

  await build({
    entry: ['src/index.ts'],
    outDir: 'lib',
    platform: 'neutral',
    target: 'node18',
    format: 'esm',
    dts: false,
  });

  await build({
    entry: ['src/preview.ts'],
    outDir: 'lib',
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    dts: true,
  });
}
