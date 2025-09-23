import { StoryID } from '@core';
import { DeviceBoundState } from '../../behaviour/useRun/useResults';

import { UIStoryRunState } from '../../behaviour/useRun/types';
import { isDefined } from '@lib';
import { StoryRunResult } from '../../../reusables/runner/StoryRunResult';

export function toStoryBoundChanges(id: StoryID, state: DeviceBoundState[]) {
  return state
    .map((bound) =>
      UIStoryRunState.when(bound.state, {
        onDone: (details) => {
          const changes = StoryRunResult.changes(details);

          return changes ? { id, device: bound.device, changes } : undefined;
        },
        otherwise: () => undefined,
      }),
    )
    .filter(isDefined);
}
