import { MaterializedStory } from './MaterializedStory';
import { StoryEnvironment } from './config';

export type RunMode = Exploration | Emulation;

type Exploration = {
  type: 'exploration';
};

type Emulation = {
  type: 'emulation';
  story: MaterializedStory;
  env: StoryEnvironment;
};