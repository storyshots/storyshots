import { Device, StoryTree, toRunnableStoryMetas } from '@core';
import { useRef } from 'react';
import { run } from '../../../reusables/runner/run';
import { ManagerConfig } from '../useSelection/useManagerConfig';
import { useResults } from './useResults';
import { UIStoryRunState } from './types';

export function useRun(manager: ManagerConfig) {
  const results = useResults(manager);
  const abort = useAbort();

  return {
    results,

    run: (stories: StoryTree) =>
      runSyncWithUI(stories, manager.runnables.resolved),

    stop: () => abort.trigger(),
  };

  async function runSyncWithUI(stories: StoryTree, devices: Device[]) {
    const result = toRunnableStoryMetas(stories, devices, {
      previewing: false,
    });

    if (result.type === 'error') {
      console.error(result.message);

      return results.set(
        result.story.id,
        result.device,
        UIStoryRunState.create.error(result),
      );
    }

    result.data.forEach(({ story, device }) =>
      results.set(story.id, device, UIStoryRunState.create.scheduled()),
    );

    const events = run({
      stories: result.data,
      poolSize: manager.size,
      retryOnError: false,
    });

    const signal = abort.create();

    signal.addEventListener('abort', () =>
      result.data.forEach(({ story, device }) =>
        results.set(story.id, device, (state) =>
          UIStoryRunState.when(state, {
            onScheduled: () => UIStoryRunState.create.empty(),
            onRunning: () => UIStoryRunState.create.empty(),
            otherwise: () => state,
          }),
        ),
      ),
    );

    const createFromEvent = UIStoryRunState.create.onStoryRunEvent();

    for await (const event of events) {
      if (signal.aborted) {
        break;
      }

      results.set(event[0].story.id, event[0].device, createFromEvent(event));
    }
  }
}

function useAbort() {
  const controller = useRef(new AbortController());

  return {
    create: (): AbortSignal => {
      if (controller.current.signal.aborted) {
        controller.current = new AbortController();
      }

      return controller.current.signal;
    },

    trigger: (): void => controller.current.abort('Cancelled'),
  };
}
