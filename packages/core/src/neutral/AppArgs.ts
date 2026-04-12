import { StoryID } from './id';
import { Device, StoryEnvironment } from './config';
import { Story, StoryTree } from './StoryTree';
import { isNil } from '@storyshots/utils';

export type AppArgs = {
  devices: Device[];
  mode: RunMode;
};

export const AppArgs = {
  toNative: <TArg>(
    args: AppArgs,
    stories: StoryTree<TArg>,
  ): NativeAppArgs<TArg> => {
    return {
      devices: args.devices,
      mode: toNativeRunMode(args.mode, stories),
    };
  },
};

export type NativeAppArgs<TArg> = {
  devices: Device[];
  mode: NativeRunMode<TArg>;
};

type NativeRunMode<TArg> =
  | {
      type: 'exploration';
    }
  | {
      type: 'emulation';
      story: Story<TArg>;
      env: StoryEnvironment;
    };

type RunMode =
  | {
      type: 'exploration';
    }
  | {
      type: 'emulation';
      id: StoryID;
      env: StoryEnvironment;
    };

function toNativeRunMode<TArg>(
  mode: RunMode,
  stories: StoryTree<TArg>,
): NativeRunMode<TArg> {
  if (mode.type === 'exploration') {
    return mode;
  }

  const story = find(mode.id, stories);

  if (isNil(story)) {
    // Fallback to exploration mode as it is considered safe
    return { type: 'exploration' };
  }

  return { type: 'emulation', story, env: mode.env };
}

function find<TArg>(id: StoryID, tree: StoryTree<TArg>): undefined | Story<TArg> {
  if (!Array.isArray(tree)) {
    if (tree.type === 'group') {
      return find(id, tree.children);
    }

    return tree.id === id ? tree : undefined;
  }

  for (const child of tree) {
    const story = find(id, child);

    if (story) {
      return story;
    }
  }

  return undefined;
}
