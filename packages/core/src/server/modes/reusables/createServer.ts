import express, { RequestHandler, Router } from 'express';
import { regexpJSONReviver } from '../../../reusables/regexpJSON';
import { MANAGER_UNIQ_KEY } from '../../../reusables/toManagerURL';
import { createUIHandler } from '../../createUIHandler';
import { createApiHandlers } from '../../handlers';
import { ManagerConfig } from '../../types';
import { createROTypedQSProxy } from '../../../reusables/createTypedQSProxy';

export async function createServer(config: ManagerConfig) {
  const app = express();
  const router = Router();

  const api = await createApiHandlers(router, config);
  const dynamic = createLazySetHandler();

  app.use(express.json({ reviver: regexpJSONReviver }));

  app.use(createManagerPreviewSwitch(config));
  app.use(api.router);
  app.use(dynamic.handler);
  app.use(createUIHandler());

  const listening = app.listen(6006);

  return {
    app,
    use: dynamic.set,
    router,
    cleanup: async () => {
      await config.preview.cleanup();

      await api.cleanup();

      listening.close();
    },
  };
}

export type Server = Awaited<ReturnType<typeof createServer>>;

function createManagerPreviewSwitch(config: ManagerConfig): RequestHandler {
  return (request, response, next) => {
    const qs = createROTypedQSProxy({
      get: (key) => request.query[key] as string,
    });

    if (qs.get('manager') === MANAGER_UNIQ_KEY) {
      return next();
    }

    return config.preview.handler(request, response, () =>
      response.status(404).send(),
    );
  };
}

// Allows to define handler position first and handler function later
function createLazySetHandler() {
  let handle: RequestHandler = (_, __, next) => next();

  const handler: RequestHandler = (rq, rs, nt) => handle(rq, rs, nt);

  return {
    handler,
    set: (next: RequestHandler) => (handle = next),
  };
}
