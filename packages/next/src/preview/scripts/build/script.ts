import { getFromENVByKey } from '../../../neutral/safe-env';
import { nextBuild } from 'next/dist/cli/next-build';
import { assert } from '@lib';

void main();

async function main() {
  const mode = getFromENVByKey('STORYSHOTS_MODE');

  assert(mode?.type === 'master-build');

  await nextBuild({
    lint: false,
    mangling: true,
    experimentalDebugMemoryUsage: false,
    experimentalBuildMode: 'compile',
  });

  process.send?.(null);
  process.exit();
}
