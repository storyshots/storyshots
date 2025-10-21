import * as build from './scripts/build';
import * as preview from './scripts/preview';

export async function runStaticPreview(): Promise<void> {
  await build.run();

  await preview.run(false);
}
