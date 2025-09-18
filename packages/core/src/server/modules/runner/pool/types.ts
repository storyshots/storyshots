import { Page } from 'playwright';
import { StoryRunMeta } from '../../../reusables/types';
import { Task, TaskResult } from '../types';

export type Worker = {
  allocate(story: StoryRunMeta): Promise<AllocatedResource>;
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
  story: StoryRunMeta;
  task: Task;
  onDone(result: TaskResult): void;
};
