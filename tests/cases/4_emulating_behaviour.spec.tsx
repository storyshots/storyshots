import { test } from '../fixtures/ui';

test('allows to emulate behaviour', async ({ ui }) => {
  await ui.change(({ createPreviewApp, useState, finder }) => {
    type Externals = {
      read(): string;
      write(next: string): void;
    };

    const { run, it } = createPreviewApp({
      createExternals: () => ({}) as Externals,
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        arrange: (_, { journal }) => {
          let name = 'Ivan';

          return {
            read: () => name,
            write: journal.asRecordable(
              'write',
              (_name) => void (name = _name),
            ),
          };
        },
        act: (actor) =>
          actor.screenshot('Initial').click(finder.getByText('Update')),
        render: ({ read, write }) => {
          const [name, setName] = useState(read());

          return (
            <div>
              <h1>{name}</h1>
              <button
                onClick={() => {
                  write('Vasiliy');

                  setName(read());
                }}
              >
                Update
              </button>
            </div>
          );
        },
      }),
    );
  });

  await ui.run('is a story');

  await ui.open('Records');

  await ui.screenshot();

  await ui.open('Initial');

  await ui.screenshot();

  await ui.open('FINAL');

  await ui.screenshot();
});
