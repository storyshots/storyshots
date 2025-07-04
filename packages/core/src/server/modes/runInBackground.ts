import { assertNotEmpty } from '@lib';
import { chromium } from 'playwright';
import { driver } from '../../reusables/runner/driver';
import { createManagerRootURL } from '../paths';
import { ManagerConfig, PublicManagerConfig } from '../types';
import { createServer } from './reusables/createServer';

export async function runInBackground(_config: PublicManagerConfig) {
  const config: ManagerConfig = { ..._config, mode: 'background' };

  const server = await createServer(config);

  return {
    ...server,
    run: async () => {
      const browser = await chromium.launch();

      const page = await browser.newPage();

      await page.goto(createManagerRootURL(config).href, { timeout: 0 });

      const handle = await page.waitForFunction(() => window.runAll(), null, {
        timeout: 0,
      });

      const summary = await handle.jsonValue();

      assertNotEmpty(summary);

      await browser.close();

      if (summary.errors.length > 0) {
        summary.errors.forEach((error, index) => {
          console.log(`\n`);
          console.log(`#${index + 1} ${error.id}`);
          console.log(`Device: ${error.device.name}`);
          console.log(`Error : ${error.message}`);
        });

        throw new Error('Failed to run tests, check errors above');
      }

      if (summary.changes.length > 0) {
        console.log('Baseline changes has been detected, commiting...');
      }

      for (const change of summary.changes) {
        if (change.records) {
          await driver.acceptRecords({
            id: change.id,
            device: change.device,
            records: change.records,
          });
        }

        for (const screenshot of change.screenshots) {
          await driver.acceptScreenshot(screenshot);
        }
      }

      console.log('Done');
    },
  };
}
