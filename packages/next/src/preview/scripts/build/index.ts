import { fork } from 'node:child_process';
import { createENVFromKey } from '../../../neutral/safe-env';
import { getScriptPath } from '../reusables/getScriptPath';
import * as process from 'node:process';

// Generates master build
export function run() {
  const build = fork(getScriptPath('build'), {
    env: {
      ...process.env,
      NODE_ENV: 'development',
      ...createENVFromKey('STORYSHOTS_MODE', {
        type: 'master-build',
      }),
    },
    stdio: 'inherit',
  });

  return new Promise<void>((resolve) => build.on('message', () => resolve()));
}
