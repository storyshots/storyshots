import { assertIsNever } from '@lib';
import {
  MasterBuildMode,
  DefaultMode,
  getFromENVByKey,
  PreviewMode,
  StoryMode,
  StoryshotsMode,
} from './safe-env';

export function onModeSwitch<T>(cases: {
  onStory: (story: StoryMode) => T;
  onPreview: (preview: PreviewMode) => T;
  onBuild: (build: MasterBuildMode) => T;
  onDefault: (_default: DefaultMode) => T;
}): T {
  const mode = getMode();

  switch (mode.type) {
    case 'default':
      return cases.onDefault(mode);
    case 'preview':
      return cases.onPreview(mode);
    case 'story':
      return cases.onStory(mode);
    case 'master-build':
      return cases.onBuild(mode);
  }

  assertIsNever(mode, `Unknown mode was supplied ${mode}`);
}

function getMode(): StoryshotsMode {
  return getFromENVByKey('STORYSHOTS_MODE') ?? { type: 'default' };
}
