import { test } from '../fixtures/ui';

test('displays no stories by default', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run([]);
  });

  await ui.screenshot();
});

test('allows to define a story', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
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

  await ui.screenshot();

  await ui.open('is a story');

  await ui.screenshot();
});

test('captures story changes live', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
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

  await ui.open('is a story');

  await ui.screenshot();

  await ui.change(({ createPreviewApp }) => {
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

  await ui.screenshot();
});

test('allows to generate and accept fresh baseline', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
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

  await ui.run('is a story');

  await ui.screenshot();

  await ui.open('Records');

  await ui.screenshot();

  await ui.open('FINAL');

  await ui.screenshot();

  await ui.accept('is a story');

  await ui.screenshot();
});

test('allows to catch and accept visual changes', async ({
  ui,
  page,
}) => {
  await ui.change(({ createPreviewApp }) => {
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

  await ui.run('is a story');

  await ui.accept('is a story');

  await ui.change(({ createPreviewApp }) => {
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

  await ui.run('is a story');

  await ui.screenshot();

  await ui.open('FINAL');

  await ui.screenshot();

  await page.getByText('2-up').click();

  await ui.screenshot();

  await page.getByText('Diff', { exact: true }).click();

  await ui.screenshot();

  await ui.accept('is a story');

  await ui.screenshot();
});
