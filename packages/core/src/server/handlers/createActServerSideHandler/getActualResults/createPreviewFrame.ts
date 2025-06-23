import { Page } from 'playwright';
import { createStoryURL } from '../../../paths';
import { toPreviewFrame } from '../../reusables/toPreviewFrame';
import { ExpectedPayload } from './types';

export async function createPreviewFrame(
  { story, config }: ExpectedPayload,
  page: Page,
) {
  await page.goto(createStoryURL(story, config).href, {
    timeout: 0,
  });

  /**
   * Availability of getJournalRecords signals that onPreview was called by preview module
   * which means that app is loaded.
   */
  await page.waitForFunction(() => window.getJournalRecords, null, {
    timeout: 0,
  });

  return toPreviewFrame(page);
}
