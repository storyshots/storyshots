import { Arranger, UnknownArranger } from '@storyshots/arrangers';
import { EndpointArgs, Endpoints, UnknownEndpoint } from '../types';

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
   * https://storyshots.github.io/storyshots/modules/msw#endpoint
   */
  endpoint<TPath extends keyof Endpoints>(
    name: TPath,
    endpoint: PartialByKey<Endpoints[TPath], 'handle'>,
  ): Arranger<TExternals>;
  /**
   * https://storyshots.github.io/storyshots/modules/msw#handle
   */
  handle<TPath extends keyof Endpoints>(
    name: TPath,
    handle: Endpoints[TPath]['handle'],
  ): Arranger<TExternals>;
  /**
   * https://storyshots.github.io/storyshots/modules/msw#transform
   */
  transform<TPath extends keyof Endpoints>(
    name: TPath,
    fn: (
      result: Awaited<ReturnType<Endpoints[TPath]['handle']>>,
      args: EndpointArgs,
    ) => Awaited<ReturnType<Endpoints[TPath]['handle']>>,
  ): Arranger<TExternals>;
  /**
   * https://storyshots.github.io/storyshots/modules/msw#record
   */
  record<TPath extends keyof Endpoints>(
    name: TPath,
    handle?: Endpoints[TPath]['handle'],
  ): Arranger<TExternals>;
};

type PartialByKey<T, TKey extends keyof T> = Omit<T, TKey> &
  Partial<Pick<T, TKey>>;
