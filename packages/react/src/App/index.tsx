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
  /**
   * When bundler reloads page after a change, it may do so at specific location
   * (e.g. http://localhost/users and not at http://localhost/users).
   *
   * In such scenario we can not update our stories because preview state was not reset fully (/users is also a STATE).
   *
   * That is because url is a persistent state (like localStorage for example), while RAM stored data is not.
   * Resetting url after a change must be preview responsibility because strategy might change depending
   * on the implementation details.
   *
   * Thus, we must reload our page manually to point specifically at root location statically.
   */
  if (location.pathname !== '/') {
    location.replace(location.origin);

    return;
  }

  const active = parent.onPreviewReady(stories, {
    frame: { type: 'self' },
  });

  if (isNil(active)) {
    return <Placeholder />;
  }

  return <View active={active} factory={factory} />;
};
