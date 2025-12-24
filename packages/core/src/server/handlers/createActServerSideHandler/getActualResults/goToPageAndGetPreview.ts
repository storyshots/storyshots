import { Page } from 'playwright';
import { createStoryURL } from '../../../paths';
import { toPreviewFrameLocator } from '../../reusables/toPreviewFrameLocator';
import { ExpectedPayload } from './types';

export async function goToPageAndGetPreview(
  { story, config }: ExpectedPayload,
  page: Page,
) {
  await page.goto(createStoryURL(story, config).href, {
    timeout: 0,
  });

  return toPreviewFrameLocator(page);
}
