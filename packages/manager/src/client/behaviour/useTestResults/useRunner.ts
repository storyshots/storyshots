import { isNil, PreviewState, PureStory, TestConfig } from '@storyshots/core';
import { useRef, useState } from 'react';
import { createRunnableStoriesSuits } from '../../../reusables/runner/createRunnableStoriesSuits';
import { isOnRun } from '../../../reusables/runner/isOnRun';
import { run } from '../../../reusables/runner/run';
import { TestResults } from './types';

export function useRunner() {
  const [results, setResults] = useState<TestResults>(new Map());
  const abort = useAbort();
  const agentsCount = useAgentsCount();

  return {
    results,
    setResults,
    run: (stories: PureStory[], config: TestConfig) => {
      const tests = createRunnableStoriesSuits(stories, [config]);

      return run({
        stories: tests,
        abort: abort.get(),
        agentsCount,
        onResult: (id, result) =>
          setResults((results) => new Map(results.set(id, result))),
      });
    },
    runComplete: async (stories: PureStory[], preview: PreviewState) => {
      const tests = createRunnableStoriesSuits(
        stories,
        preview.devices.map((device) => ({ device })),
      );

      return run({
        stories: tests,
        agentsCount,
        abort: abort.get(),
        onResult: (id, result) =>
          setResults((results) => new Map(results.set(id, result))),
      });
    },
    stopAll: () => {
      abort.trigger();

      removeAllOnRun();
    },
  };

  function removeAllOnRun() {
    results.forEach((result, id) => {
      if (result.type === 'success' && result.details.length > 0) {
        result.running = false;
      }

      if (isOnRun(result)) {
        results.delete(id);
      }
    });

    setResults(new Map(results));
  }
}

function useAgentsCount() {
  const url = new URL(location.href);

  const agentsCount = url.searchParams.get('agentsCount');

  return isNil(agentsCount) ? 1 : parseInt(agentsCount);
}

function useAbort() {
  const controller = useRef(new AbortController());

  return {
    get: (): AbortSignal => {
      if (controller.current.signal.aborted) {
        controller.current = new AbortController();
      }

      return controller.current.signal;
    },
    trigger: (): void => controller.current.abort('Cancelled'),
  };
}
