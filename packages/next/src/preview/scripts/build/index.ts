import { fork } from 'node:child_process';
import { createENVFromKey } from '../../../neutral/safe-env';
import { getScriptPath } from '../reusables/getScriptPath';

// Generates master build
export function run() {
  const build = fork(getScriptPath('build'), {
    env: {
      ...(createENVFromKey('STORYSHOTS_MODE', {
        type: 'master-build',
      }) as NodeJS.ProcessEnv),
      NODE_ENV: 'development',
    },
    stdio: 'inherit',
  });

  return new Promise<void>((resolve) => build.on('message', () => resolve()));
}
