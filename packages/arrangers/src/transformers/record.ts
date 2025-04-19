import { assert } from '../../../../lib/utils';
import { UnknownArrangers } from '../arrangers-types';
import { compose } from './compose';

export const record: UnknownArrangers['record'] = (path, handler) =>
  compose(path, (method, config) => {
    if (handler) {
      return config.journal.asRecordable(path, handler);
    }

    assert(
      typeof method === 'function',
      `record expects function key, but found ${typeof method} by ${path}`,
    );

    return config.journal.asRecordable(path, method as never);
  });
