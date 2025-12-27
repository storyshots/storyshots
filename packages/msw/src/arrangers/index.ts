import { StoryConfig } from '@storyshots/core';
import { Arrangers, UnknownArranger, UnknownArrangers } from '@storyshots/arrangers';
import { Endpoints, UnknownEndpoint } from '../types';
import { body, params, query } from '../utils';
import { MSWArrangers, UnknownMSWArrangers } from './types';
import { assertIsEndpoint } from '../assertIsEndpoint';

/**
 * https://storyshots.github.io/storyshots/modules/msw#createmswarrangers
 */
export function createMSWArrangers<TExternals>(
  arrangers: Arrangers<TExternals, Endpoints>,
) {
  return _create(
    arrangers as UnknownArrangers,
  ) as unknown as MSWArrangers<TExternals>;
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
        await config.journal.record(name, {
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
    return arrangers.compose(name, (endpoint, config): UnknownEndpoint => {
      assertIsEndpoint(name, endpoint);

      return {
        ...endpoint,
        handle: fn(endpoint.handle, config),
      };
    });
  }
}
