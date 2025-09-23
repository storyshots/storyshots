import { RunnableStoryMeta } from '@core';
import { StoryRunState } from './StoryRunState';

export type RunConfig = {
  stories: RunnableStoryMeta[];
  poolSize: number;
  /**
   * Whether to retry when error has been occurred.
   *
   * Like when element was not found during 10 seconds interval
   */
  retryOnError: boolean;
};

export type StoryRunEvent = [meta: RunnableStoryMeta, state: StoryRunState];
