import { createENVFromKey } from '../../../neutral/safe-env';
import { fork } from 'node:child_process';
import { getScriptPath } from '../reusables/getScriptPath';

export function run(dev: boolean) {
  const preview = fork(getScriptPath('preview'), {
    env: createENVFromKey('STORYSHOTS_MODE', {
      type: 'preview',
      dev,
    }) as NodeJS.ProcessEnv,
    stdio: 'inherit',
  });

  return new Promise<void>((resolve) =>
    preview.once('message', () => resolve()),
  );
}
