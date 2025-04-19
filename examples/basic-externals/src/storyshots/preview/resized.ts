import { map, StoryTree } from '@storyshots/core';
import { IExternals } from '../../externals/types';

export const resized = (
  config: Record<string, number>,
  stories: StoryTree<IExternals>,
) => {
  return map(stories, (story) => ({
    ...story,
    resize: (device) => {
      const height = config[device.name];

      if (height === undefined) {
        return device;
      }

      return { ...device, height };
    },
  }));
};
