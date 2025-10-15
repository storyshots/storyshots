import { Device, GroupID, isStoryChildOfGroup, StoryID } from '@core';
import { UIStoryRunState } from './types';
import { ManagerConfig } from '../useSelection/useManagerConfig';
import { useState } from 'react';

type ResultsStorage = Map<StoryID, Map<Device, UIStoryRunState>>;

export function useResults(manager: ManagerConfig) {
  const [results, setResults] = useState<ResultsStorage>(new Map());

  const utils = {
    // Returns specific result for a given story and device
    device: (id: StoryID, device: Device): UIStoryRunState => {
      // Leaves only results that belong to selected devices on config panel
      if (manager.runnables.resolved.includes(device)) {
        return results.get(id)?.get(device);
      }
    },
    // Returns all results for a given story
    story: (id: StoryID): DeviceBoundState[] => {
      return manager.runnables.resolved.map((device) => ({
        device,
        state: utils.device(id, device),
      }));
    },
    // Returns all results for a given group
    group: (group: GroupID): StoryBoundState[] => {
      return utils.all().filter(({ id }) => isStoryChildOfGroup(group, id));
    },
    // Returns all results
    all: (): StoryBoundState[] => {
      return Array.from(results.entries()).flatMap(([id]) =>
        utils.story(id).map((state) => ({ ...state, id })),
      );
    },
    // Similar to refiner but works backwards
    set(
      id: StoryID,
      device: Device,
      update: UIStoryRunState | ((state: UIStoryRunState) => UIStoryRunState),
    ): void {
      setResults((results) => {
        const state = results.get(id) ?? new Map();

        state.set(
          device,
          typeof update === 'function' ? update(state.get(device)) : update,
        );

        results.set(id, state);

        return new Map(results);
      });
    },
  };

  return utils;
}

export type StoryBoundState = {
  id: StoryID;
  device: Device;
  state: UIStoryRunState;
};

export type DeviceBoundState = { device: Device; state: UIStoryRunState };
