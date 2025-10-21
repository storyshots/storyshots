import { WaitForURLAction } from '@core';
import { Frame } from 'playwright';

export async function doWaitForURL(
  preview: Frame,
  waitForURL: WaitForURLAction,
) {
  return preview.waitForURL(waitForURL.payload.url, waitForURL.payload.options);
}
