import path from 'path';
import { chromium, Page } from 'playwright';
import { createManagerRootURL } from '../../paths';
import { ManagerConfig } from '../../types';

export async function openAppAndGetPage(config: ManagerConfig): Promise<Page> {
  const context = await chromium.launchPersistentContext(
    path.join('./.storyshots', 'chrome-data'),
    {
      timeout: 0,
      headless: false,
      viewport: null,
      bypassCSP: true,
      ignoreDefaultArgs: ['--enable-automation'],
      args: [
        `--app=${createManagerRootURL(config).href}`,
        '--start-maximized',
        '--test-type=gpu',
        '--disable-web-security',
      ],
    },
  );

  context.setDefaultTimeout(10_000);

  const [page] = context.pages();

  return page;
}
