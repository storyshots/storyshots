import fs from 'node:fs/promises';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import {
  Screenshot,
} from '../../../neutral/screenshot/Screenshot';
import { ScreenshotComparisonResult } from '../../../neutral/run-event/BaselineComparison';
import { isNil } from '@storyshots/utils';
import { createScreenshotPath } from '../utils/createScreenshotPath';

export async function createScreenshotComparisonResult(
  expectedScreenshots: Screenshot[],
  actualScreenshots: Screenshot[],
): Promise<ScreenshotComparisonResult[]> {
  const results: ScreenshotComparisonResult[] = [];

  for (const actual of actualScreenshots) {
    const expected = expectedScreenshots.find((it) => it.name === actual.name);

    if (isNil(expected)) {
      results.push({
        type: 'fresh',
        actual: actual.path,
        name: actual.name,
      });

      continue;
    }

    const actualBuffer = await fs.readFile(actual.path);
    const expectedBuffer = await fs.readFile(expected.path);
    const comparison = compare(actualBuffer, expectedBuffer);

    if (comparison.type === 'equal') {
      results.push({
        type: 'pass',
        actual: actual.path,
        expected: expected.path,
        name: actual.name,
      });

      continue;
    }

    if (comparison.type === 'layout-mismatch') {
      results.push({
        type: 'fail',
        actual: actual.path,
        expected: expected.path,
        name: actual.name,
        explanation: 'Actual screenshot layout does not match expected layout',
      });

      continue;
    }

    results.push({
      type: 'fail',
      actual: actual.path,
      expected: expected.path,
      name: actual.name,
      diff: await createScreenshotPath(comparison.diff),
      explanation: `Detected ${comparison.count} mismatched pixel(s)`,
    });
  }

  return results;
}

function compare(actual: Buffer, expected: Buffer): ComparisonResult {
  const actualImage = PNG.sync.read(actual);
  const expectedImage = PNG.sync.read(expected);

  if (
    actualImage.width !== expectedImage.width ||
    actualImage.height !== expectedImage.height
  ) {
    return { type: 'layout-mismatch' };
  }

  const diffImage = new PNG({
    width: actualImage.width,
    height: actualImage.height,
  });

  const mismatchedPixelCount = pixelmatch(
    actualImage.data,
    expectedImage.data,
    diffImage.data,
    actualImage.width,
    actualImage.height,
    { threshold: 0.2 },
  );

  if (mismatchedPixelCount === 0) {
    return { type: 'equal' };
  }

  return {
    type: 'not-equal',
    count: mismatchedPixelCount,
    diff: PNG.sync.write(diffImage),
  };
}

type ComparisonResult =
  | {
      type: 'equal';
    }
  | { type: 'layout-mismatch' }
  | { type: 'not-equal'; count: number; diff: Buffer };
