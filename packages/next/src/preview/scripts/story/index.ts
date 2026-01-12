import { DefinedActiveStory } from '../../../neutral/types';
import { fork } from 'node:child_process';
import { createENVFromKey } from '../../../neutral/safe-env';
import { assert } from '@lib';
import { getScriptPath } from '../reusables/getScriptPath';

export function run(active: DefinedActiveStory, { dev }: { dev: boolean }) {
  const story = fork(getScriptPath('story'), {
    env: {
      ...process.env,
      ...createENVFromKey('STORYSHOTS_MODE', {
        type: 'story',
        dev,
        ...active,
      }),
    },
    stdio: 'inherit',
  });

  return {
    host: new Promise<string>((resolve) =>
      story.on('message', (host) => {
        assert(typeof host === 'string');

        resolve(host);
      }),
    ),
    kill: story.kill.bind(story),
  };
}
