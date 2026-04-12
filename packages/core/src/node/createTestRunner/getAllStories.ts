import { RunnerConfig } from '../RunnerConfig';
import { AppArgs } from '../../neutral/AppArgs';
import { Device } from '../../neutral/config';
import { chromium } from 'playwright-core';
import { assertNotEmpty } from '@storyshots/utils';
import { TestRunner } from './types';

export async function getAllStories(
  config: RunnerConfig,
): ReturnType<TestRunner['getAll']> {
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
