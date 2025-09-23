import path from 'path';

void main();

interface Reporter {
  onConfigure(config: {
    metadata: {
      actualWorkers: number;
    };
  }): void;

  // Даже на retry?
  onBegin(suite: { allTests(): { length: number } }): void;

  onTestBegin(test: Record<string, unknown>, result: { retry: number }): void;

  formatTestTitle(): string;

  onEnd(result: {}): void;
}

// npx ts-node C:\Users\khaimov\WebstormProjects\storyshots\tests\check.ts
async function main() {
  const { default: LineReporter } = require(
    path.join(
      path.dirname(require.resolve('playwright')),
      '/lib/reporters/line.js',
    ),
  );

  const reporter: Reporter = new LineReporter();

  reporter.formatTestTitle = () => 'My title';

  reporter.onConfigure({
    metadata: {
      actualWorkers: 4,
    },
  });

  reporter.onBegin({
    allTests: () => ({ length: 10 }),
  });

  reporter.onTestBegin({}, { retry: 0 });

  setTimeout(() => reporter.onTestBegin({}, { retry: 0 }), 2_000);
}
