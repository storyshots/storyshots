import { toRunnableStoryMetas } from '@core';
import { Selection } from './useSelection/types';
import { ManagerConfig } from './useSelection/useManagerConfig';

export function useExposeAllStories(state: Selection, manager: ManagerConfig) {
  window.getAllStories = () => {
    if (state.type === 'initializing') {
      return;
    }

    return toRunnableStoryMetas(state.stories, manager.devices, {
      previewing: false,
    });
  };
}
