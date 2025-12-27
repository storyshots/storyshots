import { EndpointArgs, Endpoints, UnknownEndpoint } from './types';
import { http, HttpResponse, RequestHandler } from 'msw';
import { isNil } from '@lib';
import { assertIsEndpoint } from './assertIsEndpoint';

export function toRequestHandlers(endpoints: Endpoints): RequestHandler[] {
  return Object.entries(endpoints).map(([key, endpoint]) => {
    assertIsEndpoint(key, endpoint);

    return http[toHTTPMethod(endpoint.method)](
      endpoint.url,
      toMSWResolver(endpoint.handle),
    );
  });
}

function toMSWResolver(handle: UnknownEndpoint['handle']) {
  return async (info: EndpointArgs): Promise<HttpResponse> => {
    try {
      const response = await handle(info);

      return HttpResponse.json(response as never);
    } catch (error) {
      // To support "magic" api like native() function
      if (error instanceof HttpResponse) {
        return error;
      }

      throw error;
    }
  };
}

function toHTTPMethod(method: UnknownEndpoint['method']): keyof typeof http {
  if (isNil(method)) {
    return 'get';
  }

  return method.toLowerCase() as never;
}
