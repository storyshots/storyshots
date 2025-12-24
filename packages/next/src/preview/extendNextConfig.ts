import { NextConfig } from 'next';
import { onModeSwitch } from '../neutral/onModeSwitch';

type Config = {
  storiesRoot: string;
  config: NextConfig;
};

export function extendNextConfig(config: Config): NextConfig {
  return onModeSwitch({
    onStory: ({ dev }) => ({
      ...createStoryshotsNextConfig(config),
      distDir: dev ? './.storyshots/.story' : './.storyshots/.build',
    }),
    onPreview: ({ dev }) => ({
      ...createStoryshotsNextConfig(config),
      distDir: dev ? './.storyshots/.preview' : './.storyshots/.build',
    }),
    onBuild: () => ({
      ...createStoryshotsNextConfig(config),
      distDir: './.storyshots/.build',
    }),
    onDefault: () => createNoStoryshotsNextConfig(config),
  });
}

function createStoryshotsNextConfig({ config: base }: Config): NextConfig {
  return {
    ...base,
    output: undefined,
    devIndicators: false,
    outputFileTracingExcludes: {
      '*': ['**/*.*'],
    },
    webpack: (...args) => {
      args[0].optimization.minimizer = [];

      return base.webpack?.(...args) ?? args[0];
    },
  };
}

function createNoStoryshotsNextConfig({
  config: base,
  storiesRoot,
}: Config): NextConfig {
  return {
    ...base,
    webpack: (...args) => {
      const stubs = require.resolve('@storyshots/next/stubs');

      args[0].resolve!.alias = {
        ...args[0].resolve!.alias,
        [storiesRoot]: stubs,
        '@storyshots/next/client': stubs,
        '@storyshots/next': stubs,
      };

      return base.webpack?.(...args) ?? args[0];
    },
  };
}
