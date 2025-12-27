import { test } from '../fixtures/ui';

test('allows to define intermediate shots', async ({ ui }) => {
  await ui.change(({ createPreviewApp, finder }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run([
      it('is a story', {
        act: (actor) =>
          actor
            .screenshot('Initial')
            .click(finder.getByLabel('Remember me'))
            .screenshot('Checked')
            .click(finder.getByLabel('Remember theme')),
        render: () => (
          <>
            <label>
              Remember me
              <input type="checkbox" />
            </label>
            <label>
              Remember theme
              <input type="checkbox" />
            </label>
          </>
        ),
      }),
    ]);
  });

  await ui.run('is a story');

  await ui.screenshot();

  await ui.open('Initial');

  await ui.screenshot();

  await ui.open('Checked');

  await ui.screenshot();

  await ui.open('FINAL');

  await ui.screenshot();

  await ui.accept('is a story');

  await ui.screenshot();

  await ui.change(({ createPreviewApp, finder }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run([
      it('is a story', {
        act: (actor) =>
          actor
            .screenshot('Initial')
            .click(finder.getByLabel('Remember theme'))
            .screenshot('Checked')
            .click(finder.getByLabel('Remember me')),
        render: () => (
          <>
            <label>
              Remember me
              <input type="checkbox" />
            </label>
            <label>
              Remember theme
              <input type="checkbox" />
            </label>
          </>
        ),
      }),
    ]);
  });

  await ui.run('is a story');

  await ui.open('Checked');

  await ui.screenshot();

  await ui.accept('is a story');

  await ui.screenshot();
});

// {
//   ui(
//     'allows to define intermediate shots',
//     setup()
//       .open('EmailFilled')
//       .screenshot()
//       .open('MessageFilled')
//       .screenshot()
//       .open('FINAL')
//       .screenshot(),
//   );
//
//   ui('allows to accept all', setup().accept('is a story').screenshot());
//
//   ui(
//     'checks each shot separately',
//     setup()
//       .accept('is a story')
//       .preview()
//       .story(render(() => <textarea placeholder="Message:" />))
//       .actor()
//       .run('is a story')
//       .open('EmailFilled')
//       .do((page) => page.getByText('2-up').click())
//       .screenshot()
//       .do((page) => page.getByText('Diff', { exact: true }).click())
//       .screenshot(),
//   );
// }