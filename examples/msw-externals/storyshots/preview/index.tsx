import React, { useEffect, useState } from 'react';
import { setupWorker } from 'msw/browser';
import { map } from '@storyshots/core';

import { stories } from '../stories';
import { run } from './config';
import { PureApp } from '../../src/PureApp';
import { Endpoints, toRequestHandlers } from '@storyshots/msw-externals';

void run(
  map(stories, (story) => ({
    render: (externals) => (useInitialized(externals) ? <PureApp /> : null),
    ...story,
  })),
);

function useInitialized(endpoints: Endpoints) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    void setupWorker(...toRequestHandlers(endpoints))
      .start()
      .then(() => setInitialized(true));
  }, []);

  return initialized;
}
