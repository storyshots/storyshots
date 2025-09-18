import fs from 'fs';
import path from 'path';
import looksSame from 'looks-same';

void main();

// npx ts-node ./misc/smart-compare/compare.ts
async function main() {
  const suits = readSuitsFromFS();
  const comparators = createComparators();

  for await (const comparator of comparators) {
    const results = await evaluate(comparator, suits);

    console.log(comparator.name, results.accuracy);
  }
}

// Always equal comparator 0.6097560975609756
// Always not equal comparator 0.3902439024390244
// looks-same 0.6829268292682927
// playwright-default 0.7317073170731707
// playwright-ssim 0.6097560975609756
// playwright custom tuned 0.8292682926829268
// Лучший это playwright custom tuned 0.8292682926829268

// Добавить threshold и diffRation для looks-same
// Рассмотреть другие варианты алгоритмов
// Перепроверить тестовые данные (возможно стоит их сделать более объективными)

function createComparators(): Comparator[] {
  return [
    {
      name: 'Always equal comparator',
      compare: async () => ({ equal: true }),
    },
    {
      name: 'Always not equal comparator',
      compare: async () => ({ equal: false }),
    },
    {
      name: 'looks-same',
      compare: looksSame,
    },
    {
      name: 'playwright-default',
      compare: createPlaywrightComparator(),
    },
    {
      name: 'playwright-ssim',
      compare: createPlaywrightComparator({ comparator: 'ssim-cie94' }),
    },
    {
      name: 'playwright custom tuned',
      compare: createPlaywrightComparator({
        maxDiffPixelRatio: 5 / (1480 * 920),
      }),
    },
  ];
}

type CompareOptions = {
  comparator?: 'ssim-cie94' | 'pixelmatch';
  threshold?: number;
  maxDiffPixels?: number;
  maxDiffPixelRatio?: number;
};

function createPlaywrightComparator(
  options?: CompareOptions,
): Comparator['compare'] {
  const { getComparator } = require(
    path.join(
      path.dirname(require.resolve('playwright-core')),
      '/lib/server/utils/comparators.js',
    ),
  );

  const comparePNG = getComparator('image/png');

  return async (actual, expected) => {
    const result = comparePNG(actual, expected, options);

    return { equal: result === null, explanation: result?.errorMessage };
  };
}

type CompareResult = { equal: boolean; explanation?: string };

type Comparator = {
  name: string;
  compare(imageA: Buffer, imageB: Buffer): Promise<CompareResult>;
};

type Score = {
  accuracy: number;
  mistakes: Array<{ suite: Suite; result: CompareResult }>;
};

async function evaluate(
  comparator: Comparator,
  suits: Suite[],
): Promise<Score> {
  const mistakes = [];

  for await (const suite of suits) {
    const result = await comparator.compare(suite.baseline(), suite.source());

    if (result.equal === suite.equal) {
      continue;
    }

    mistakes.push({ suite, result });
  }

  return {
    accuracy: (suits.length - mistakes.length) / suits.length,
    mistakes,
  };
}

type Suite = {
  name: string;
  equal: boolean;
  source(): Buffer;
  baseline(): Buffer;
};

function readSuitsFromFS(): Suite[] {
  const group = path.join(__dirname, 'color-and-size');

  const baseline: Suite['baseline'] = () =>
    fs.readFileSync(path.join(group, 'baseline.png'));

  fs.readdirSync(path.join(group, 'equal')).map(
    (image): Suite => ({
      equal: true,
      name: image,
      source: () => fs.readFileSync(path.join(group, 'equal', image)),
      baseline,
    }),
  );

  return [...createSuite('equal'), ...createSuite('not-equal')];

  function createSuite(folder: 'equal' | 'not-equal'): Suite[] {
    return fs.readdirSync(path.join(group, folder)).map(
      (image): Suite => ({
        equal: folder === 'equal',
        name: image,
        source: () => fs.readFileSync(path.join(group, folder, image)),
        baseline,
      }),
    );
  }
}
