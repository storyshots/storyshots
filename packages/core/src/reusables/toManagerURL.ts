import { createTypedQSProxy } from './createTypedQSProxy';

export function toManagerURL(url: string | URL): URL {
  const converted: URL = typeof url === 'string' ? new URL(url) : url;
  const qs = createTypedQSProxy(converted.searchParams);

  qs.set('manager', MANAGER_UNIQ_KEY);

  return converted;
}

export const MANAGER_UNIQ_KEY = 1758895046634;
