import { MaterializedStory } from '../../../neutral/story/MaterializedStory';
import { Page } from 'playwright';
import { RunConfig } from '../RunConfig';
import { AsyncLocalStorage } from 'node:async_hooks';
import { assertNotEmpty } from '@storyshots/utils';

type RunContext = RunConfig & {
  story: MaterializedStory;
  page: Page;
};

export const RunContext = {
  wrap: <T>(value: RunContext, fn: () => T) => context.run(value, fn),
  use: () => {
    const value = context.getStore();

    assertNotEmpty(value);

    return value;
  },
};

const context = new AsyncLocalStorage<RunContext>();
