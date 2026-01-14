import send from 'send';
import { assert } from '@lib';
import { Router } from 'express';

export function createImagePathHandler(router: Router) {
  router.get('/api/image/path', async (request, response) => {
    const file = request.query.file;

    assert(typeof file === 'string');

    response.setHeader('Surrogate-Control', 'no-store');

    response.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );

    response.setHeader('Expires', '0');

    return send(request, file, {
      dotfiles: 'allow',
      cacheControl: false,
      etag: false,
    }).pipe(response);
  });
}
