// Represents full path to saved screenshot (either actual or expected)
import { Brand } from '@storyshots/utils';
import { ScreenshotName } from './ScreenshotName';

// Represents full path to saved screenshot (either actual or expected)
export type ScreenshotPath = Brand<string, 'ScreenshotPath'>;

export type Screenshot = {
  name: ScreenshotName;
  path: ScreenshotPath;
};
