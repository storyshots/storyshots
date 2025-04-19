import { isNil } from '@lib';
import { http, HttpResponse, RequestHandler } from 'msw';
import { setupWorker, StartOptions } from 'msw/browser';
import React, { useEffect, useState } from 'react';
import { EndpointArgs, Endpoints, UnknownEndpoint } from './types';

type Props = {
  endpoints: Endpoints;
  options?: StartOptions;
};

export const MSWReplacer: React.FC<React.PropsWithChildren<Props>> = ({
  endpoints,
  options,
  children,
}) => {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    void setupWorker(...toRequestHandlers(endpoints as UnknownEndpoints))
      .start(options)
      .then(() => setInitializing(false));
  }, []);

  if (initializing) {
    return null;
  }

  return children;
};

function toRequestHandlers(endpoints: UnknownEndpoints): RequestHandler[] {
  return Object.values(endpoints).map((endpoint) =>
    http[toHTTPMethod(endpoint.method)](
      endpoint.url,
      toMSWResolver(endpoint.handle),
    ),
  );
}

function toMSWResolver(handle: UnknownEndpoint['handle']) {
  return async (info: EndpointArgs): Promise<HttpResponse> => {
    try {
      const response = await handle(info);

      return HttpResponse.json(response as never);
    } catch (e) {
      if (e instanceof HttpResponse) {
        return e;
      }

      throw e;
    }
  };
}

function toHTTPMethod(method: UnknownEndpoint['method']): keyof typeof http {
  if (isNil(method)) {
    return 'get';
  }

  return method.toLowerCase() as never;
}

type UnknownEndpoints = Record<string, UnknownEndpoint>;
