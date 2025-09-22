import { toManagerURL } from '../reusables/runner/toManagerURL';
import { StoryRunMeta } from './reusables/types';
import { ManagerConfig } from './types';

export const createManagerRootURL = (config: ManagerConfig) => {
  const url = new URL('http://localhost:6006');

  url.searchParams.set('size', `${config.runner.size}`);
  url.searchParams.set('devices', `${JSON.stringify(config.devices)}`);
  url.searchParams.set('mode', `${config.mode}`);

  return toManagerURL(url);
};

export const createStoryURL = (meta: StoryRunMeta, config: ManagerConfig) => {
  const url = createManagerRootURL(config);

  // TODO: Must be type related with config parsing functions
  url.searchParams.set('device', JSON.stringify(meta.device));
  url.pathname = `/chromium/${meta.story.id}`;

  return url;
};
