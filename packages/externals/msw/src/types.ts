import { http, HttpResponseResolver } from 'msw';

/**
 * https://storyshots.github.io/storyshots/modules/msw#endpoints
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Endpoints {}

export type Endpoint<TResponse> = {
  method?: Uppercase<keyof typeof http>;
  url: string;
  handle(args: EndpointArgs): PromiseLike<TResponse> | TResponse;
};

export type EndpointArgs = Parameters<HttpResponseResolver>[0];

export type EndpointResult<T> = T extends Endpoint<infer R> ? R : unknown;

export type UnknownEndpoint = Endpoint<unknown>;
