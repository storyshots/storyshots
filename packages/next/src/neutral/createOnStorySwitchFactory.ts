import { find } from '@storyshots/core/toolbox';
import { onModeSwitch } from './onModeSwitch';
import { ExternalsFactory } from './types';
import { assertNotEmpty } from '@lib';
import { createSharedJournal } from './createSharedJournal';
import { StoryTree, StoryConfig } from '@storyshots/core';

export const createOnStorySwitchFactory =
  <TExternals>(factories: ExternalsFactory<TExternals>) =>
  (stories: StoryTree<TExternals>) =>
  <T>(cases: {
    onStory(externals: TExternals, config: StoryConfig): T;
    otherwise(): T;
  }) =>
    onModeSwitch({
      onStory: (active) => {
        const story = find(active.story.id, stories);

        assertNotEmpty(
          story,
          `Was not able to find a story ${active.story.id}`,
        );

        const config: StoryConfig = {
          previewing: active.env.previewing,
          device: active.env.device,
          journal: createSharedJournal(),
        };

        const defaults = factories.createExternals(config);
        const arranged = story.arrange?.(defaults, config) ?? defaults;
        const journaled = factories.createJournalExternals(arranged, config);

        return cases.onStory(journaled, config);
      },
      onBuild: cases.otherwise,
      onPreview: cases.otherwise,
      onDefault: cases.otherwise,
    });
