import { UserDefinedManagerConfig } from '../../types';
import { createStoryshotsServer } from '../reusables/createStoryshotsServer';
import { attachActHandler } from './attachActHandler';
import { openAppAndGetPage } from './createAttachedDriver';

/**
 * https://storyshots.github.io/storyshots/API/manager/runUI
 */
export async function runUI(config: UserDefinedManagerConfig) {
  const server = await createStoryshotsServer({
    ...config,
    preview:
      typeof config.preview === 'function'
        ? await config.preview('ui')
        : config.preview,
  });

  const page = await openAppAndGetPage(server);

  attachActHandler(server, page);
}
