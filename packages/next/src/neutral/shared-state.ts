import { onModeSwitch } from './onModeSwitch';
import { assert } from '@lib';

export function createSharedState<T>(key: string, initial: T): SharedState<T> {
  return onModeSwitch({
    onStory: () => createSupportedStorage(key, initial) as SharedState<T>,
    onBuild: createUnsupportedStorage,
    onPreview: createUnsupportedStorage,
    onDefault: createUnsupportedStorage,
  });
}

type SharedState<T> = {
  update(updater: (prev: T) => T): Promise<void>;
  get(): Promise<T>;
};

function createSupportedStorage(
  key: string,
  initial: unknown,
): SharedState<unknown> {
  const storage: SharedState<unknown> = {
    update: async (updater) => {
      await call({ action: 'start-update' });

      await call({
        action: 'finish-update',
        payload: { key, value: updater(await storage.get()) },
      });
    },
    get: async () => {
      const response = await call({ action: 'get', payload: { key } });

      const text = await response.text();

      return text.length === 0 ? initial : JSON.parse(text);
    },
  };

  return storage;

  async function call(body: StoryStorageBody) {
    const response = await fetch(createURL('/__story_storage'), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    assert(response.ok);

    return response;
  }
}

function createUnsupportedStorage(): SharedState<never> {
  return {
    update: () => {
      throw new Error('Storage supported only on story mode.');
    },
    get: () => {
      throw new Error('Storage supported only on story mode.');
    },
  };
}

function createURL(path: string) {
  return `${process.env.__NEXT_PRIVATE_ORIGIN ?? ''}${path}`;
}

export type StoryStorageBody =
  | { action: 'get'; payload: { key: string } }
  | {
      action: 'start-update';
    }
  | {
      action: 'finish-update';
      payload: { key: string; value: unknown };
    };
