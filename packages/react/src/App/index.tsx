import { isNil } from '@lib';
import { map, StoryTree } from '@storyshots/core';
import { ExternalsFactory } from '../types';
import { Placeholder } from './Placeholder';
import { View } from './View';
import React from 'react';

export const createStoryView = (
  stories: StoryTree,
  factory: ExternalsFactory<unknown>,
) => {
  const active = parent.onPreviewReady(initialize(stories, factory));

  if (isNil(active)) {
    return <Placeholder />;
  }

  return (
    <View
      {...active}
      externals={active.story.arrange(undefined, active.config)}
    />
  );
};

function initialize(stories: StoryTree, factory: ExternalsFactory<unknown>) {
  return map(stories, (story) => ({
    ...story,
    arrange: (_, config) => {
      const initial = factory.createExternals(config);

      const arranged = story.arrange(initial, config);

      return factory.createJournalExternals(arranged as never, config);
    },
  }));
}
