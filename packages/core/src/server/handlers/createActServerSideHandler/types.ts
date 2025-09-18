import { StoryRunMeta } from '../../reusables/types';
import { ManagerConfig } from '../../types';
import { Baseline } from '../reusables/baseline';

export type BasePayload = {
  story: StoryRunMeta;
  baseline: Baseline;
  config: ManagerConfig;
};
