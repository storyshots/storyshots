import { createENVFromKey } from '../../../neutral/safe-env';
import { fork } from 'node:child_process';
import { getScriptPath } from '../reusables/getScriptPath';
import * as process from 'node:process';

export function run({ dev }: { dev: boolean }) {
  const preview = fork(getScriptPath('preview'), {
    env: {
      ...process.env,
      ...createENVFromKey('STORYSHOTS_MODE', {
        type: 'preview',
        dev,
      }),
    },
    stdio: 'inherit',
  });

  return {
    ready: new Promise<void>((resolve) =>
      preview.once('message', () => resolve()),
    ),
    kill: preview.kill.bind(preview),
  };
}
