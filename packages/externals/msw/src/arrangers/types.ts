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
  handle<TEndpoint extends keyof Endpoints>(
    name: TEndpoint,
    handle: Endpoints[TEndpoint]['handle'],
  ): Arranger<TExternals>;
  transform<TEndpoint extends keyof Endpoints>(
    name: TEndpoint,
    fn: (
      result: EndpointResult<Endpoints[TEndpoint]>,
      args: EndpointArgs,
    ) => ReturnType<Endpoints[TEndpoint]['handle']>,
  ): Arranger<TExternals>;
  record<TEndpoint extends keyof Endpoints>(
    name: TEndpoint,
    handle?: Endpoints[TEndpoint]['handle'],
  ): Arranger<TExternals>;
  endpoint<TEndpoint extends keyof Endpoints>(
    name: TEndpoint,
    endpoint: PartialByKey<Endpoints[TEndpoint], 'handle'>,
  ): Arranger<TExternals>;
};

type PartialByKey<T, TKey extends keyof T> = Omit<T, TKey> &
  Partial<Pick<T, TKey>>;
