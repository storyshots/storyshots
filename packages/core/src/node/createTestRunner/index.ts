import { RunnerConfig } from '../RunnerConfig';
import { TestRunner } from './types';
import { getAllStories } from './getAllStories';

export function createTestRunner(config: RunnerConfig): TestRunner {
  return {
    getAll: () => getAllStories(config),
  };
}
