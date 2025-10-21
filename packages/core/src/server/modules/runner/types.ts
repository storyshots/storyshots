import { Page } from 'playwright';


import { RunnableStoryMeta } from '@core';
import { WithPossibleError } from '../../../reusables/error';
import { StoryRunResult } from '../../../reusables/runner/StoryRunResult';

export type Runner = {
  size: number;
  create(): Promise<RunnerInstance>;
};

type RunnerInstance = {
  schedule(story: RunnableStoryMeta, task: Task): Promise<TaskResult>;
  close(): Promise<unknown>;
};

export type Task = (page: Page) => Promise<TaskResult>;

export type TaskResult = WithPossibleError<StoryRunResult>;
