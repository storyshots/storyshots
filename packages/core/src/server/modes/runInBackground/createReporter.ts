import colors from 'colors/safe';
import { Device, InitializationError, RunnableStoryMeta } from '@core';
import { ManagerConfig } from '../../types';
import { Duration } from '../../../reusables/duration';
import { assertNotEmpty, isDefined, isNil } from '@lib';
import { StoryRunState } from '../../../reusables/runner/StoryRunState';
import { StoryRunResult } from '../../../reusables/runner/StoryRunResult';
import { Results } from './createResults';

export const createReporter = (config: ManagerConfig) => {
  return {
    onInitialize: () => console.log('Retrieving stories'),
    onInitializeError: (error: InitializationError) => {
      console.log('\n');

      console.log(colors.red('Failed to initialize'));

      console.log('\n');

      console.log(toShallowErrorString(error));
      console.log(error.message);
    },
    onInitializeComplete: (stories: RunnableStoryMeta[]) => {
      console.log(
        'Running',
        stories.length,
        'stories using',
        config.runner.size,
        'agents',
      );
    },
    onStoryStateChange: (stories: RunnableStoryMeta[], results: Results) => {
      const event = results.events().at(-1);

      assertNotEmpty(event);

      const [story, state] = event;
      const part: LogPart = StoryRunState.when(state, {
        onRunning: () => {
          // TODO: Add option to display when test is running
          /* Do nothing when test is running */
          return undefined;
        },
        onDone: (details, { duration }) =>
          StoryRunResult.when(details, {
            onFail: () => toFailString(story, results, duration),
            onFresh: () => toFreshString(story, results, duration),
            onPass: () => toPassString(story, results, duration),
          }),
        onError: (_, { duration }) => toErrorString(story, results, duration),
      });

      if (isNil(part)) {
        return;
      }

      return console.log(withStoryProgress(stories, results, part));
    },
    onAllStoriesRan: (results: Results) => {
      console.log('\n');

      if (results.errors().length > 0) {
        console.log(colors.red(`${results.errors().length} errors:`));

        console.log('\n');

        results.errors().forEach(([story, error]) => {
          console.log(toShallowErrorString(story));
          console.log(error.message);
        });
      }

      const failures = results.done().filter(([, details]) =>
        StoryRunResult.when(details, {
          onFail: () => true,
          otherwise: () => false,
        }),
      );

      if (failures.length > 0) {
        console.log(colors.red(`${failures.length} failed:`));
        console.log('\n');

        failures.forEach(([event]) => console.log(toShallowFailString(event)));

        console.log('\n');
      }

      // Story is considered flaky when it is pass and also was retried
      const flaky = results
        .done()
        .filter(([, details]) =>
          StoryRunResult.when(details, {
            onPass: () => true,
            otherwise: () => false,
          }),
        )
        .filter(([story]) => results.attempts(story).length > 1);

      if (flaky.length > 0) {
        console.log(colors.yellow(`${flaky.length} flaky:`));
        console.log('\n');

        flaky.forEach(([event]) => console.log(toFlakyString(event)));

        console.log('\n');
      }

      const fresh = results.done().filter(([, details]) =>
        StoryRunResult.when(details, {
          onFresh: () => true,
          otherwise: () => false,
        }),
      );

      if (fresh.length > 0) {
        console.log(colors.blue(`${fresh.length} fresh`));
      }

      const pass = results.done().filter(([, details]) =>
        StoryRunResult.when(details, {
          onPass: () => true,
          otherwise: () => false,
        }),
      );

      if (pass.length > 0) {
        console.log(colors.green(`${pass.length} passed`));
      }
    },
    onFinish: (durations: { building: Duration; running: Duration }) => {
      console.log('\n');

      console.log('Durations:');
      console.log(`Building ${toDurationString(durations.building)}`);
      console.log(`Running ${toDurationString(durations.running)}`);
    },
    onAfterChangesApplied: (results: Results) => {
      if (results.changes().length > 0) {
        console.log('\n');

        console.log(
          colors.yellow(
            'Baseline have been updated. Ensure changes are expected.',
          ),
        );
      }
    },
  };
};

type ShallowStoryRunMeta = {
  story: { title: string; parents: string[] };
  device: Device;
};

function toPassString(
  story: RunnableStoryMeta,
  results: Results,
  duration: Duration,
) {
  return join(
    colors.green('pass'),
    toStoryTitleString(story),
    toFlakyStatusString(story, results),
    toDurationString(duration),
  );
}

function toFreshString(
  story: RunnableStoryMeta,
  results: Results,
  duration: Duration,
) {
  return join(
    colors.blue('fresh'),
    toStoryTitleString(story),
    toFlakyStatusString(story, results),
    toDurationString(duration),
  );
}

function toFailString(
  story: RunnableStoryMeta,
  results: Results,
  duration: Duration,
) {
  return join(
    toShallowFailString(story),
    toRetryString(story, results),
    toDurationString(duration),
  );
}

function toFlakyString(story: ShallowStoryRunMeta) {
  return join(colors.yellow('flaky'), toStoryTitleString(story));
}

function toShallowFailString(story: ShallowStoryRunMeta) {
  return join(colors.red('fail'), toStoryTitleString(story));
}

function withStoryProgress(
  stories: RunnableStoryMeta[],
  results: Results,
  part: LogPart,
) {
  const ran = [...results.done(), ...results.errors()].length;
  const total = stories.length;

  return join(colors.grey(`${((ran / total) * 100).toFixed(0)}%`), part);
}

function toErrorString(
  story: RunnableStoryMeta,
  results: Results,
  duration: Duration,
) {
  return join(
    toShallowErrorString(story),
    toRetryString(story, results),
    toDurationString(duration),
  );
}

function toShallowErrorString(story: ShallowStoryRunMeta) {
  return join(colors.bgRed('error'), colors.red(toStoryTitleString(story)));
}

function toFlakyStatusString(story: RunnableStoryMeta, results: Results) {
  const attempts = results.attempts(story);

  if (attempts.length === 1) {
    return;
  }

  return colors.yellow(`(flaky)`);
}

function toRetryString(story: RunnableStoryMeta, results: Results) {
  const attempts = results.attempts(story);

  if (attempts.length === 1) {
    return;
  }

  return colors.yellow(`(retry #${attempts.length - 1})`);
}

function toDurationString(duration: Duration) {
  return colors.grey(`(${Duration.toString(duration)})`);
}

function toStoryTitleString({ story, device }: ShallowStoryRunMeta) {
  return [`[${device.name}]`, ...story.parents, story.title].join(' > ');
}

function join(...parts: LogPart[]): LogPart {
  return parts.filter(isDefined).join(' ');
}

type LogPart = string | undefined;
