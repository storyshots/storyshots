import path from 'path';

void main();

interface Reporter {
  onConfigure(config: {
    metadata: {
      actualWorkers: number;
    };
  }): void;

  onBegin(suite: { allTests(): { length: number } }): void;
}

async function main() {
  const { default: LineReporter } = require(
    path.join(
      path.dirname(require.resolve('playwright')),
      '/lib/reporters/line.js',
    ),
  );

  const reporter: Reporter = new LineReporter();

  reporter.onConfigure({
    metadata: {
      actualWorkers: 4,
    },
  });

  reporter.onBegin({
    allTests: () => ({ length: 10 }),
  });
}
