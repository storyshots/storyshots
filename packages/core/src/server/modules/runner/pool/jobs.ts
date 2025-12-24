import { Task, TaskResult } from '../types';
import { Job } from './types';

import { RunnableStoryMeta } from '@core';

export const jobs = {
  create: (): Job[] => [],
  schedule: (jobs: Job[], story: RunnableStoryMeta, task: Task, onScheduled: () => void) =>
    new Promise<TaskResult>((onDone) => {
      jobs.push({ story, task, onDone });

      onScheduled();
    }),
  available: (jobs: Job[]) => jobs.shift(),
};
