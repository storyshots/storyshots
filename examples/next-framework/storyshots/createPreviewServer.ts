import { type IPreviewServer } from '@storyshots/core/manager';
import createServer from 'next';
import { parse } from 'url';
import config from '../next.config';

export async function createPreviewServer(): Promise<IPreviewServer> {
  const app = createServer({
    dev: true,
    dir: process.cwd(),
    conf: { ...config },
  });

  await app.prepare();

  const handle = app.getRequestHandler();

  return {
    handler: (req, res) => handle(req, res, parse(req.url, true)),
    onUpdate: () => {},
    cleanup: () => app.close(),
  };
}
