import { test } from '../fixtures/tf';

import { runCI, runUI } from '../fixtures/modes';
import { UserDefinedManagerConfig } from '@storyshots/core/manager';
import { expect } from '@playwright/test';

test('allows to run all', async ({ tf, page }) => {
  tf.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        render: () => <h1>Hello, app!</h1>,
      }),
    );
  });

  await runCI(tf, DEVICES);

  // TODO: Is there a way do dynamically inject fixtures?
  const { ui, cleanup } = await runUI(tf, page, DEVICES);

  try {
    await ui.run('is a story');

    await ui.screenshot();
  } finally {
    await cleanup();
  }
});

test('accepts any changes automatically', async ({ tf, page }) => {
  tf.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        render: () => <h1>Hello, app!</h1>,
      }),
    );
  });

  await runCI(tf, DEVICES);

  tf.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        render: () => <h1>Bye, app!</h1>,
      }),
    );
  });

  await runCI(tf, DEVICES);

  const { ui, cleanup } = await runUI(tf, page, DEVICES);

  try {
    await ui.run('is a story');
    await ui.open('FINAL');

    await ui.screenshot();
  } finally {
    await cleanup();
  }
});

test('does not do anything when there is no diff', async ({ tf, page }) => {
  tf.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        render: () => <h1>Hello, app!</h1>,
      }),
    );
  });

  const client_0 = await runUI(tf, page, DEVICES);

  try {
    await client_0.ui.run('is a story');
    await client_0.ui.accept('is a story');
  } finally {
    await client_0.cleanup();
  }

  await runCI(tf, DEVICES);

  const client_1 = await runUI(tf, page, DEVICES);

  try {
    await client_1.ui.run('is a story');

    await client_1.ui.screenshot();
  } finally {
    await client_1.cleanup();
  }
});

test('throws when error has occurred', async ({ tf, page }) => {
  tf.change(({ createPreviewApp, finder }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        act: (actor) => actor.click(finder.getByText('Click me')),
        render: () => (
          <>
            <button>Click me</button>
            <button>Click me</button>
          </>
        ),
      }),
    );
  });

  await expect(() => runCI(tf, DEVICES)).rejects.toThrow();
});

// TODO: Unify devices
const DEVICES: UserDefinedManagerConfig['devices'] = [
  {
    name: 'desktop',
    width: 1480,
    height: 920,
  },
];
