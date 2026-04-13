import { StoryTree } from '../neutral/story/StoryTree';
import { MaterializedStory } from '../neutral/story/MaterializedStory';
import { AppArgs, NativeAppArgs } from '../neutral/AppArgs';
import { Journal } from '../neutral/Journal';

export function createNativeAppArgsConnectRunner<TArg>(
  stories: StoryTree<TArg>,
  createJournal: () => Promise<Journal>,
): Promise<NativeAppArgs<TArg>> {
  return new Promise((resolve) => {
    window.onRunnerConnected = (args) => {
      resolve(AppArgs.toNative(args, stories));

      return MaterializedStory.materialize(stories, args.devices);
    };

    window.createJournal = createJournal;
  });
}
