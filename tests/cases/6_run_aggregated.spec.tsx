import { test } from '../fixtures/ui';

test('allows to run and accept whole group at once', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, describe, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      describe('Group', [
        describe('SubGroup', [
          it('is second', {
            render: (_, { journal }) => {
              journal.record('is second');

              return 'is second';
            },
          }),
        ]),
        it('is first', {
          render: (_, { journal }) => {
            journal.record('is first');

            return 'is first';
          },
        }),
      ]),
    );
  });

  await ui.run('Group');

  await ui.screenshot();

  await ui.open('Group');
  await ui.open('SubGroup');

  await ui.open('Records', 'is second');

  await ui.screenshot();

  await ui.open('FINAL', 'is second');

  await ui.screenshot();

  await ui.open('Records', 'is first');

  await ui.screenshot();

  await ui.open('FINAL', 'is first');

  await ui.screenshot();

  await ui.accept('Group');

  await ui.screenshot();
});
