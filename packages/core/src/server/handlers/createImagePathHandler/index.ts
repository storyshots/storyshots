import send from 'send';
import { assert } from '@lib';
import { Router } from 'express';

export function createImagePathHandler(router: Router) {
  router.get('/api/image/path', async (request, response) => {
    const file = request.query.file;

    assert(typeof file === 'string');

    return send(request, file).pipe(response);
  });
}
