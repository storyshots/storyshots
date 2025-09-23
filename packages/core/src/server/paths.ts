import { toManagerURL } from '../reusables/toManagerURL';
import { ManagerConfig } from './types';

import { Device, RunnableStoryMeta } from '@core';
import { createTypedQSProxy } from '../reusables/createTypedQSProxy';

export const createManagerRootURL = (config: ManagerConfig) => {
  const url = new URL('http://localhost:6006');
  const qs = createTypedQSProxy(url.searchParams);

  qs.set('size', config.runner.size);
  qs.set('devices', config.devices as Device[]);

  return toManagerURL(url);
};

export const createStoryURL = (meta: RunnableStoryMeta, config: ManagerConfig) => {
  const url = createManagerRootURL(config);
  const qs = createTypedQSProxy(url.searchParams);

  qs.set('preview', meta.device);
  url.pathname = `/chromium/${meta.story.id}`;

  return url;
};
