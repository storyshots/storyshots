import { MaterializedStory } from '../../neutral/MaterializedStory';

export type ImageComparator = (
  actual: Buffer,
  expected: Buffer,
  story: MaterializedStory
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
