import { assertNotEmpty } from '@lib';
import { StoryConfig } from '@storyshots/core';
import {
  Arrangers,
  UnknownArranger,
  UnknownArrangers,
} from '@storyshots/arrangers';
import { Endpoints, UnknownEndpoint } from '../types';
import { body, params, query } from '../utils';
import { MSWArrangers, UnknownMSWArrangers } from './types';

export function createMSWArrangers<TExternals>(
  arrangers: Arrangers<TExternals, Endpoints>,
) {
  return _create(arrangers as UnknownArrangers) as MSWArrangers<TExternals>;
}

function _create(arrangers: UnknownArrangers): UnknownMSWArrangers {
  return {
    endpoint: (name, endpoint) =>
      arrangers.set(name, {
        handle: () => {
          throw new Error(`${name} does not contain a handler`);
        },
        ...endpoint,
      }),
    handle: (name, handle) => mapHandler(name, () => handle),
    transform: (name, fn) =>
      mapHandler(
        name,
        (original) => async (args) => fn(await original(args), args),
      ),
    record: (name, fn) =>
      mapHandler(name, (original, config) => async (args) => {
        config.journal.record(name, {
          query: query(args),
          params: params(args),
          body: await body(args),
        });

        return fn ? fn(args) : original(args);
      }),
  };

  function mapHandler(
    name: string,
    fn: (
      handler: UnknownEndpoint['handle'],
      config: StoryConfig,
    ) => UnknownEndpoint['handle'],
  ): UnknownArranger {
    return arrangers.compose(name, (_endpoint, config): UnknownEndpoint => {
      const endpoint = _endpoint as UnknownEndpoint | undefined;

      assertNotEmpty(endpoint, `${name} endpoint is not defined`);

      return {
        ...endpoint,
        handle: fn(endpoint.handle, config),
      };
    });
  }
}
