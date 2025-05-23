import type { HttpResponseResolver } from 'msw';

export interface Endpoints {}

export type Endpoint<TResponse> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  handle(args: EndpointArgs): PromiseLike<TResponse> | TResponse;
};

export type EndpointArgs = Parameters<HttpResponseResolver>[0];

export type EndpointResult<T> = T extends Endpoint<infer R> ? R : unknown;

export type UnknownEndpoint = Endpoint<unknown>;
