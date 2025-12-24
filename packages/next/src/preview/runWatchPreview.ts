import * as preview from './scripts/preview';

export async function runWatchPreview(): Promise<void> {
  await preview.run(true);
}
