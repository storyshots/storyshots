import { ActionMeta } from '@core';
import { RequestHandler } from 'express';
import { Page } from 'playwright';
import { act } from '../../act';
import { handlePossibleErrors } from '../../handlers/reusables/handlePossibleErrors';
import { toPreviewFrameLocator } from '../../handlers/reusables/toPreviewFrameLocator';
import { StoryshotsServer } from '../reusables/createStoryshotsServer';
import { WithPossibleError } from '../../../reusables/error';

export function attachActHandler(server: StoryshotsServer, page: Page): RequestHandler {
  return server.router.post('/api/client/act', async (request, response) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const actions: ActionMeta[] = request.body;

    const result: WithPossibleError<void> = await handlePossibleErrors(
      async () => {
        const preview = await toPreviewFrameLocator(page);

        for (const action of actions) {
          if (action.action === 'screenshot' || action.action === 'resize') {
            continue;
          }

          if (action.action === 'stop') {
            break;
          }

          await act(preview, action);
        }
      },
    );

    response.json(result);
  });
}
