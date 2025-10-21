import { COMPARE } from './modules/compare';
import { CAPTURE } from './modules/capture';
import { RUNNER } from './modules/runner';
import { UserDefinedManagerConfig } from './types';

export function createManagerConfig(config: UserDefinedManagerConfig) {
  return {
    compare: COMPARE.withPlaywright(),
    capture: CAPTURE.stabilized({
      attempts: 5,
      interval: (attempt) => 100 * Math.pow(2, attempt),
    }),
    runner: RUNNER.pool({ agentsCount: 1 }),
    ...config,
  };
}
