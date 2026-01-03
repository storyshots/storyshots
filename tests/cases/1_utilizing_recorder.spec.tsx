import { test } from '../fixtures/ui';

test('allows to journal function calls', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run([
      it('is a story', {
        render: () => <button>Make a call</button>,
      }),
    ]);
  });

  await ui.run('is a story');

  await ui.open('Records');

  await ui.accept('is a story');

  await ui.screenshot();

  await ui.change(({ createPreviewApp, finder }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run([
      it('is a story', {
        act: (actor) => actor.click(finder.getByText('Make a call')),
        render: (_, { journal }) => (
          <button onClick={() => journal.record('call', 'arg0', 'arg1')}>
            Make a call
          </button>
        ),
      }),
    ]);
  });

  await ui.run('is a story');

  await ui.screenshot();

  await ui.accept('is a story');

  await ui.screenshot();
});
