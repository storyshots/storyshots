import { Device } from '@core';
import { isNil } from '@lib';

declare global {
  // Declares global extendable qs storage
  interface QSStorage {
    // manager unique key
    manager: number;
    // pool size
    size: number;
    // user defined devices
    devices: Device[];
    // device, selected to display on preview
    preview: Device;
  }
}

export function createTypedQSProxy(qs: QSLike) {
  const operations = {
    ...createROTypedQSProxy(qs),
    set: (key, value) => qs.set(key, JSON.stringify(value)),
    delete: (key) => qs.delete(key),
  } satisfies Operations;

  return operations as Operations;
}

export function createROTypedQSProxy(qs: Pick<QSLike, 'get'>) {
  const operations = {
    get: (key) => {
      const value = qs.get(key);

      if (isNil(value)) {
        return undefined;
      }

      return JSON.parse(value) as never;
    },
  } satisfies Pick<Operations, 'get'>;

  return operations as Operations;
}

type QSLike = {
  set(key: string, value: string): void;
  get(key: string): string | null;
  delete(key: string): void;
};

type Operations = {
  set<TKey extends keyof QSStorage>(key: TKey, value: QSStorage[TKey]): void;
  get<TKey extends keyof QSStorage>(key: TKey): QSStorage[TKey] | undefined;
  delete<TKey extends keyof QSStorage>(key: TKey): void;
};
