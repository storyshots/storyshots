import { ScreenshotAction } from '@core';
import { Frame } from 'playwright';
import { ExpectedPayload } from '../types';
import { doScreenshotAction } from './doScreenshotAction';

export function capture(
  { config, story }: ExpectedPayload,
  preview: Frame,
  action: ScreenshotAction,
) {
  return config.capture({
    story,
    capture: () => doScreenshotAction(preview, action),
  });
}
