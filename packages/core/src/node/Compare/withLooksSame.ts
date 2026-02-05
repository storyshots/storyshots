import looksSame, { LooksSameOptions } from 'looks-same';

import { ImageComparator } from './types';

export function withLooksSame(options: LooksSameOptions = {}): ImageComparator {
  return async (actual, expected) => {
    const results = await looksSame(actual, expected, {
      ...options,
      createDiffImage: true,
    });

    if (results.equal) {
      return { equal: true };
    }

    const total = results.differentPixels / results.totalPixels;

    return {
      equal: false,
      explanation: `${results.differentPixels} pixels (ratio of ${
        total < 0.001 ? '<0.001' : `~${total.toFixed(3)}`
      } of all image pixels) are different`,
      diff: await results.diffImage.createBuffer('png'),
    };
  };
}
