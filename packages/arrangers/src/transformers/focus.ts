import { UnknownArrangers } from '../arrangers-types';
import { arrange } from './arrange';
import { compose } from './compose';
import { record } from './record';
import { set } from './set';
import { transform } from './transform';

export const focus: UnknownArrangers['focus'] = (parent) => {
  return {
    arrange,
    set: (path, value) => set(join(parent, path), value),
    record: (path, handler) => record(join(parent, path), handler),
    transform: (path, handler) => transform(join(parent, path), handler),
    compose: (path, transform) => compose(join(parent, path), transform),
    focus: (sub) => focus(join(parent, sub)),
  };
};

export const EMPTY_PATH = {} as never;

const join = (parent: string, sub: string) =>
  parent === EMPTY_PATH ? sub : `${parent}.${sub}`;
