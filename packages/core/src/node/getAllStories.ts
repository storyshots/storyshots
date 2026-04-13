import { AppArgs } from '../neutral/AppArgs';
import { Device } from '../neutral/story/config';
import { chromium } from 'playwright-core';
import { assertNotEmpty } from '@storyshots/utils';
import { MaterializationResult } from '../neutral/story/MaterializedStory';
import { StoryshotsConfig } from './StoryshotsConfig';

export async function getAllStories(
  config: StoryshotsConfig,
): Promise<MaterializationResult> {
  const args: AppArgs = {
    devices: config.devices.map(Device.create),
    mode: { type: 'exploration' },
  };

  await using server = await config.createServer(args);

  await using browser = await chromium.launch({
    args: ['--disable-web-security'],
  });

  await using page = await browser.newPage();

  await page.goto(server.at, { timeout: 0 });

  const handle = await page.waitForFunction(
    (_args) => window.onRunnerConnected?.(_args),
    args,
    {
      timeout: 0,
    },
  );

  const stories = await handle.jsonValue();

  assertNotEmpty(stories);

  return stories;
}

