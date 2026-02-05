import path from 'node:path';

import { ImageComparator } from './types';

type Options = {
  comparator?: 'ssim-cie94' | 'pixelmatch';
  threshold?: number;
  maxDiffPixels?: number;
  maxDiffPixelRatio?: number;
};

export function withPlaywright(options?: Options): ImageComparator {
  const { getComparator } = require(
    path.join(
      path.dirname(require.resolve('playwright-core')),
      '/lib/server/utils/comparators.js',
    ),
  );

  const comparePNG = getComparator('image/png');

  return async (actual, expected) => {
    const result = comparePNG(actual, expected, options);

    return {
      equal: result === null,
      explanation: result?.errorMessage,
      diff: result?.diff,
    };
  };
}
