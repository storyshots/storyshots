import { ManagerConfig } from './ManagerConfig';
import { assertNotEmpty, notImplemented, Stream } from '@storyshots/utils';
import {
  MaterializationResult,
  MaterializedStory,
} from '../neutral/MaterializedStory';
import { chromium } from 'playwright-core';
import { PreviewState } from '../neutral/createPreviewClientConnection';
import { Device } from '../neutral/config';

export function createTestRunner(config: ManagerConfig): TestRunner {
  return {
    getAll: async () => {
      await using server = await config.server({ type: 'exploration' });

      await using browser = await chromium.launch({
        headless: false,
        args: ['--disable-web-security'],
      });

      await using page = await browser.newPage();

      await page.goto(server.at, { timeout: 0 });

      const state: PreviewState = {
        devices: config.devices.map(Device.create),
        active: undefined,
      };

      const handle = await page.waitForFunction(
        (_state) => window.createPreviewClientConnection?.(_state),
        state,
        {
          timeout: 0,
        },
      );

      const stories = await handle.jsonValue();

      assertNotEmpty(stories);

      return stories;
    },
    run: () => {
      notImplemented();
    },
  };
}

type TestRunner = {
  getAll(): Promise<MaterializationResult>;
  run(stories: MaterializedStory[]): Stream<0, void>;
};
