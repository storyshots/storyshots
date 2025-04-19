import { assert } from '../../../../lib/utils';
import { UnknownArrangers, UnknownFunction } from '../arrangers-types';
import { compose } from './compose';

export const transform: UnknownArrangers['transform'] = (path, handler) =>
  compose(path, (method): UnknownFunction => {
    assert(
      typeof method === 'function',
      `transform expects function key, but found ${typeof method} by ${path}`,
    );

    return async (...args) => handler(await method(...args), ...args);
  });
