import { UnknownEndpoint } from './types';

export function assertIsEndpoint(
  key: string,
  endpoint: unknown,
): asserts endpoint is UnknownEndpoint {
  if (
    typeof endpoint === 'object' &&
    endpoint !== null &&
    'url' in endpoint &&
    typeof endpoint.url === 'string' &&
    'handle' in endpoint &&
    typeof endpoint.handle === 'function'
  ) {
    return;
  }

  throw new Error(
    `${key} contains ${endpoint}. Expected ${key} to point to Endpoint object instead.`,
  );
}
