import { Story } from '@core';
import { DeviceToTestRunState } from '../../../reusables/runner/types';
import { createSummary } from '../../../reusables/summary';
import { Summary } from '../../../reusables/summary/types';
import { UseBehaviourProps } from '../../behaviour/types';

export function getStoryEntrySummary(
  story: Story,
  { results, selection, device }: UseBehaviourProps,
): Summary {
  return createSummary(new Map([[story.id, createFromStoryResults()]]));

  function createFromStoryResults(): DeviceToTestRunState | undefined {
    const defaults = results.get(story.id);

    if (selection.type !== 'story') {
      return defaults;
    }

    if (selection.story.id !== story.id) {
      return defaults;
    }

    if (selection.progress.type === 'not-played') {
      return defaults;
    }

    if (selection.progress.type === 'playing') {
      return new Map([[device.preview, { type: 'running' }]]);
    }

    if (selection.progress.result.type === 'success') {
      return defaults;
    }

    return new Map([
      [
        device.preview,
        {
          type: 'done',
          details: {
            type: 'error',
            message: selection.progress.result.message,
          },
        },
      ],
    ]);
  }
}
