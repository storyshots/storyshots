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
    page: preview.page(),
    capture: () => doScreenshotAction(preview, action),
    manager: config,
  });
}
