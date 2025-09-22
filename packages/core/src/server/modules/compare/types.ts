import { StoryRunMeta } from '../../reusables/types';

export type ImageComparator = (
  actual: Buffer,
  expected: Buffer,
  story: StoryRunMeta,
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
