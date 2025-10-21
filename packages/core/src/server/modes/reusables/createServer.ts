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
  const preview = await config.preview(config);

  app.use(express.json({ reviver: regexpJSONReviver }));

  app.use((request, response, next) => {
    const qs = createROTypedQSProxy({
      get: (key) => request.query[key] as string,
    });

    if (qs.get('manager') === MANAGER_UNIQ_KEY) {
      return next();
    }

    return preview.handler(request, response, () =>
      response.status(404).send(),
    );
  });

  app.use(api.router);
  app.use(dynamic.handler);
  app.use(createUIHandler());

  const listening = app.listen(6006);

  return {
    app,
    use: dynamic.set,
    router,
    cleanup: async () => {
      await preview.cleanup?.();

      await api.cleanup();

      listening.close();
    },
  };
}

export type Server = Awaited<ReturnType<typeof createServer>>;

// Allows to define handler position first and handler function later
function createLazySetHandler() {
  let handle: RequestHandler = (_, __, next) => next();

  const handler: RequestHandler = (rq, rs, nt) => handle(rq, rs, nt);

  return {
    handler,
    set: (next: RequestHandler) => (handle = next),
  };
}
