import { Router } from 'express';
import { Baseline } from './reusables/baseline';

import { ChangedScreenshot } from '../../reusables/runner/StoryRunResult';

export function createAcceptScreenshotHandler(
  router: Router,
  baseline: Baseline,
) {
  router.post('/api/screenshot/accept', async (request, response) => {
    // TODO: Реализовать типизированный парсинг
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const screenshot: ChangedScreenshot = request.body;

    await baseline.acceptScreenshot(screenshot.actual);

    const result: void = undefined;

    return response.end(result);
  });
}
