import { UnknownArrangers } from '../arrangers-types';

/**
 * https://storyshots.github.io/storyshots/modules/arrangers#iterated
 */
export const iterated: UnknownArrangers['iterated'] = (values, transform) => {
  let iter = 0;
  const next = () => {
    const result = values[iter % values.length];

    iter += 1;

    return result;
  };

  return transform(next);
};
