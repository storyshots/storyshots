import { HttpResponse } from 'msw';
import { EndpointArgs } from './types';

export function params(args: EndpointArgs) {
  return args.params as Record<string, unknown>;
}

export function query(args: EndpointArgs) {
  return Object.fromEntries(
    new URL(args.request.url).searchParams.entries(),
  ) as Record<string, string>;
}

export async function body(args: EndpointArgs) {
  return args.request
    .clone()
    .json()
    .catch(() => undefined) as Promise<unknown>;
}

export const native = (response: HttpResponse): never => {
  throw response;
};
