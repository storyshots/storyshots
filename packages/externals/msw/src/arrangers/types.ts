import { Arranger, UnknownArranger } from '@storyshots/arrangers';
import {
  EndpointArgs,
  EndpointResult,
  Endpoints,
  UnknownEndpoint,
} from '../types';

export type UnknownMSWArrangers = {
  endpoint(
    name: string,
    endpoint: PartialByKey<UnknownEndpoint, 'handle'>,
  ): UnknownArranger;
  transform(
    name: string,
    fn: (result: unknown, args: unknown) => unknown,
  ): UnknownArranger;
  handle(name: string, handle: UnknownEndpoint['handle']): UnknownArranger;
  record(name: string, handle?: UnknownEndpoint['handle']): UnknownArranger;
};

export type MSWArrangers<TExternals> = {
  /**
   * https://storyshots.github.io/storyshots/modules/msw#handle
   */
  handle<TEndpoint extends keyof Endpoints>(
    name: TEndpoint,
    handle: Endpoints[TEndpoint]['handle'],
  ): Arranger<TExternals>;
  /**
   * https://storyshots.github.io/storyshots/modules/msw#transform
   */
  transform<TEndpoint extends keyof Endpoints>(
    name: TEndpoint,
    fn: (
      result: EndpointResult<Endpoints[TEndpoint]>,
      args: EndpointArgs,
    ) => ReturnType<Endpoints[TEndpoint]['handle']>,
  ): Arranger<TExternals>;
  /**
   * https://storyshots.github.io/storyshots/modules/msw#record
   */
  record<TEndpoint extends keyof Endpoints>(
    name: TEndpoint,
    handle?: Endpoints[TEndpoint]['handle'],
  ): Arranger<TExternals>;
  /**
   * https://storyshots.github.io/storyshots/modules/msw#endpoint
   */
  endpoint<TEndpoint extends keyof Endpoints>(
    name: TEndpoint,
    endpoint: PartialByKey<Endpoints[TEndpoint], 'handle'>,
  ): Arranger<TExternals>;
};

type PartialByKey<T, TKey extends keyof T> = Omit<T, TKey> &
  Partial<Pick<T, TKey>>;
