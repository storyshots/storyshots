import '../externals/install-clock';

import React from 'react';
import { map } from '@storyshots/core';

import { App } from '../../App';
import { run } from './config';
import { stories } from '../stories';

void run(
  map(stories, (story) => ({
    render: (externals) => <App externals={externals} />,
    ...story,
  })),
);
