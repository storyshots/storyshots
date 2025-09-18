import { Screenshot } from '../../../../../reusables/types';
import { ExpectedPayload } from '../types';

export async function equals(
  payload: ExpectedPayload,
  screenshot: Buffer,
  other: Screenshot,
) {
  return payload.config.compare(
    screenshot,
    await payload.baseline.readScreenshot(other.path),
    payload.story,
  );
}
