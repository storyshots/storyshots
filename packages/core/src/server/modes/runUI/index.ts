import { ManagerConfig, PublicManagerConfig } from '../../types';
import { createServer } from '../reusables/createServer';
import { createActHandler } from './createActHandler';
import { openAppAndGetPage } from './createAttachedDriver';

export async function runUI(_config: PublicManagerConfig) {
  const config: ManagerConfig = { ..._config, mode: 'ui' };
  
  const server = await createServer(config);
  const page = await openAppAndGetPage(config);

  server.use(createActHandler(server, page));

  return server;
}
