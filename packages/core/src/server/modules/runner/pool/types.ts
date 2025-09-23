import { Page } from 'playwright';
import { Task, TaskResult } from '../types';

import { RunnableStoryMeta } from '../../../../core/story/runnable-story-meta';

export type Worker = {
  allocate(story: RunnableStoryMeta): Promise<AllocatedResource>;
  destroy(): Promise<void>;
};

export type AllocatedResource = { page: Page; cleanup(): Promise<void> };

export type WorkerState = FreeWorker | BusyWorker;

export type FreeWorker = {
  type: 'free';
  instance: Worker;
};

export type BusyWorker = {
  type: 'busy';
  instance: Worker;
};

export type Job = {
  story: RunnableStoryMeta;
  task: Task;
  onDone(result: TaskResult): void;
};
