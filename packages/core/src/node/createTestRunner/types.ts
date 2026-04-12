import { MaterializationResult } from '../../neutral/MaterializedStory';

export type TestRunner = {
  getAll(): Promise<MaterializationResult>;
};
