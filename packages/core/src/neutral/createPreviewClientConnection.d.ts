import { MaterializationResult } from './MaterializedStory';
import { StoryID } from './id';
import { Device, StoryEnvironment } from './config';

export type PreviewState = {
  devices: Device[];
  active: undefined | { id: StoryID; env: StoryEnvironment };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    createPreviewClientConnection?(state: PreviewState): MaterializationResult;
  }
}
