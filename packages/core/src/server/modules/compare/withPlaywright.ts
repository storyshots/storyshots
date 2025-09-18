/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import path from 'path';

import { ImageComparator } from './types';

type Options = {
  comparator?: 'ssim-cie94' | 'pixelmatch';
  threshold?: number;
  maxDiffPixels?: number;
  maxDiffPixelRatio?: number;
};

export function withPlaywright(options?: Options): ImageComparator {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
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
