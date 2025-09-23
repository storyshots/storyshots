import { useState } from 'react';
import { driver } from '../../reusables/driver';
import { useRun } from './useRun/useRun';
import { Device, StoryID } from '@core';
import { assertIsNever, assertNotEmpty } from '@lib';
import { UIStoryRunState } from './useRun/types';

import { Changes } from '../../reusables/runner/StoryRunResult';

export function useAcceptBaseline(run: ReturnType<typeof useRun>) {
  const [accepting, setAccepting] = useState(false);

  return {
    accepting,

    accept: async (changes: StoryBoundChange[]) => {
      setAccepting(true);

      for (const change of changes) {
        const { id, device, changes } = change;

        if (changes.records) {
          await driver.acceptRecords({ id, device, records: changes.records });
        }

        for (const screenshot of changes.screenshots) {
          await driver.acceptScreenshot(screenshot);
        }
      }

      // TODO: Find a way to update by fetching from server
      changes.forEach((change) =>
        run.results.set(change.id, change.device, (state) =>
          toPassState(change, state),
        ),
      );

      setAccepting(false);
    },
  };
}

const toPassState = (
  change: StoryBoundChange,
  state: UIStoryRunState,
): UIStoryRunState =>
  UIStoryRunState.when(state, {
    onDone: (details) => {
      if (change.changes.records) {
        details.records.type = 'pass';
      }

      change.changes.screenshots.forEach((screenshot) => {
        const found = details.screenshots.find(
          (it) => it.name === screenshot.name,
        );

        assertNotEmpty(found);

        found.type = 'pass';
      });

      return state;
    },
    otherwise: assertIsNever,
  });

export type StoryBoundChange = {
  id: StoryID;
  device: Device;
  changes: Changes;
};
