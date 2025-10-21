import { ManagerConfig } from '../../types';
import { Baseline } from '../reusables/baseline';

import { RunnableStoryMeta } from '@core';

export type BasePayload = {
  story: RunnableStoryMeta;
  baseline: Baseline;
  config: ManagerConfig;
};
