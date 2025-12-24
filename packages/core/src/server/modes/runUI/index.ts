import { ManagerConfig, UserDefinedManagerConfig } from '../../types';
import { createServer } from '../reusables/createServer';
import { createActHandler } from './createActHandler';
import { openAppAndGetPage } from './createAttachedDriver';
import { createManagerConfig } from '../../createManagerConfig';

/**
 * https://storyshots.github.io/storyshots/API/manager/runUI
 */
export async function runUI(_config: UserDefinedManagerConfig) {
  const config: ManagerConfig = {
    ...createManagerConfig(_config),
    mode: 'ui',
  };

  const server = await createServer(config);
  const page = await openAppAndGetPage(config);

  server.use(createActHandler(server, page));

  return server;
}
