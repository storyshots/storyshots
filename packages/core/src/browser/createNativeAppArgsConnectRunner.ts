import { StoryTree } from '../neutral/StoryTree';
import { MaterializedStory } from '../neutral/MaterializedStory';
import { AppArgs, NativeAppArgs } from '../neutral/AppArgs';

export function createNativeAppArgsConnectRunner<TArg>(
  stories: StoryTree<TArg>,
): Promise<NativeAppArgs<TArg>> {
  return new Promise((resolve) => {
    window.onRunnerConnected = (args) => {
      resolve(AppArgs.toNative(args, stories));

      return MaterializedStory.materialize(stories, args.devices);
    };
  });
}
