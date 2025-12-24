import { DefinedActiveStory } from '../../../neutral/types';
import { fork } from 'node:child_process';
import { createENVFromKey } from '../../../neutral/safe-env';
import { assert } from '@lib';
import { getScriptPath } from '../reusables/getScriptPath';

export function run(active: DefinedActiveStory, dev: boolean) {
  const story = fork(getScriptPath('story'), {
    env: createENVFromKey('STORYSHOTS_MODE', {
      type: 'story',
      dev,
      ...active,
    }) as NodeJS.ProcessEnv,
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
