import { assertIsNever, assertNotEmpty } from '@lib';
import { Page } from 'playwright';

export async function toPreviewFrameLocator(page: Page) {
  const preview = await createPreviewLocator(page);

  const handle = await preview.locator(':root').elementHandle({ timeout: 0 });
  const frame = await handle?.ownerFrame();

  assertNotEmpty(frame, 'Unable to find preview frame');

  await frame.waitForFunction(() => window.getJournalRecords, null, {
    timeout: 0,
  });

  return frame;
}

async function createPreviewLocator(page: Page) {
  const reference = await getFrameReference(page);

  switch (reference.type) {
    case 'self':
      return page.frameLocator('#preview');
    case 'id':
      return page.frameLocator('#preview').frameLocator(`#${reference.value}`);
  }

  assertIsNever(reference);
}

async function getFrameReference(page: Page) {
  const result = await page.waitForFunction(
    () => window.getAppFrameRef?.(),
    null,
    {
      timeout: 0,
    },
  );

  const reference = await result.jsonValue();

  assertNotEmpty(
    reference,
    'Expected to receive locator reference from preview',
  );

  return reference;
}
