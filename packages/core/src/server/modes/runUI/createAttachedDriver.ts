import path from 'path';
import { chromium, Page } from 'playwright';
import { StoryshotsServer } from '../reusables/createStoryshotsServer';

export async function openAppAndGetPage(
  server: StoryshotsServer,
): Promise<Page> {
  const context = await chromium.launchPersistentContext(
    path.join('./.storyshots', 'chrome-data'),
    {
      timeout: 0,
      headless: false,
      viewport: null,
      bypassCSP: true,
      ignoreDefaultArgs: ['--enable-automation'],
      args: [
        `--app=${server.root.href}`,
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
