import { test } from '../fixtures/ui';

test('allows to define externals using arrange', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({ getName: () => 'Ivan' }),
      createJournalExternals: (externals) => externals,
    });

    run([
      it('is a story', {
        render: (externals) => <h1>{externals.getName()}</h1>,
      }),
    ]);
  });

  await ui.open('is a story');

  await ui.screenshot();

  await ui.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({ getName: (): string => 'Ivan' }),
      createJournalExternals: (externals) => externals,
    });

    run([
      it('is a story', {
        arrange: (externals) => ({ ...externals, getName: () => 'Vasiliy' }),
        render: (externals) => <h1>{externals.getName()}</h1>,
      }),
    ]);
  });

  await ui.screenshot();
});
