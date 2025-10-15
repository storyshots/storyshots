import { RunnableStoryMeta } from '../../../core/story/runnable-story-meta';

export type ImageComparator = (
  actual: Buffer,
  expected: Buffer,
  story: RunnableStoryMeta,
) => Promise<ComparisonResult>;

type EqualComparisonResult = {
  equal: true;
};

export type NotEqualComparison = {
  equal: false;
  explanation?: string;
  diff?: Buffer;
};

export type ComparisonResult = EqualComparisonResult | NotEqualComparison;
