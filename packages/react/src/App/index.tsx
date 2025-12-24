import { isNil } from '@lib';
import { StoryTree } from '@storyshots/core';
import { ExternalsFactory } from '../types';
import { Placeholder } from './Placeholder';
import { View } from './View';
import React from 'react';

export const createStoryView = (
  stories: StoryTree<unknown>,
  factory: ExternalsFactory<unknown>,
) => {
  const active = parent.onPreviewReady(stories, {
    frame: { type: 'self' },
  });

  if (isNil(active)) {
    return <Placeholder />;
  }

  return <View active={active} factory={factory} />;
};
