import fs from 'node:fs';
import { test as _test } from '@playwright/test';

// Fixture to manage temporal files
type TFFixture = {
  tf: TF;
};

export const test = _test.extend<TFFixture>({
  tf: async ({}, use) => {
    const tf = createTF();

    await use(tf);

    tf.cleanup();
  },
});

export type Implementation = (
  exports: typeof import('@storyshots/core') &
    typeof import('@storyshots/react') &
    typeof import('react'),
) => void;

export type TF = {
  path: string;
  change(implementation: Implementation): void;
  cleanup(): void;
};

function createTF(): TF {
  const path = './tf.tsx';

  fs.writeFileSync(path, '');

  return {
    path: path,
    change: (implementation) =>
      fs.writeFileSync(
        path,
        `
          import * as core from '@storyshots/core';
          import * as preview from '@storyshots/react';
          import * as react from 'react';
          
          const _jsxRuntime = { jsx: react.createElement, jsxs: react.createElement, Fragment: react.Fragment };
          
          (${implementation.toString()})({ ...core, ...preview, ...react });
        `,
      ),
    cleanup: () => {
      fs.rmSync('./.storyshots', { force: true, recursive: true });
      fs.rmSync('./screenshots', { force: true, recursive: true });
      fs.rmSync('./records', { force: true, recursive: true });

      fs.unlinkSync(path);
    },
  };
}
