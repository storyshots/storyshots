import { Express } from 'express';
import { assert, assertNotEmpty } from '@lib';
import createNext from 'next';

export async function createBindNextToServer(
  app: Express,
  config: { dev: boolean; port?: number },
): Promise<string> {
  const server = await createServer(app, config.port);

  const next = createNext({ dev: config.dev, dir: './', port: server.port });

  await next.prepare();

  app.use((request, response) => next.getRequestHandler()(request, response));

  return server.host;
}

function createServer(
  app: Express,
  port?: number,
): Promise<{ host: string; port: number }> {
  return new Promise((resolve) => {
    const server = app.listen(port, async () => {
      const address = server.address();

      assert(
        typeof address === 'object',
        `Invalid address. Received ${typeof address}`,
      );

      const port = address?.port;
      const host = `http://localhost:${port}`;

      assertNotEmpty(port, 'Port must be defined');

      // Assigning env vars to emulate next-like behaviour
      process.env.PORT = port + '';
      process.env.__NEXT_PRIVATE_ORIGIN = host;

      resolve({ host, port });
    });
  });
}
