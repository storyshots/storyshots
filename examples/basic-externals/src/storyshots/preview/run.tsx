import '../externals/install-clock';

import React from 'react';
import { map } from '@storyshots/core';

import { PureApp } from '../../PureApp';
import { run } from './config';
import { stories } from '../stories';

// Module must be called at the root by definition
if (window.location.pathname === '/') {
  void run(
    map(stories, (story) => ({
      render: (externals) => <PureApp externals={externals} />,
      ...story,
    })),
  );
} else {
  // If it is not at the root, then it was hot replaced by webpack
  window.location.href = '/';
}
