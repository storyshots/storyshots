import { test } from '../fixtures/ui';

test('allows to group tests with describe', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, describe, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run([
      describe('Group', [
        it('is first', { render: () => 'is first' }),
        it('is second', { render: () => 'is second' }),
      ]),
    ]);
  });

  await ui.screenshot();

  await ui.open('Group');
  await ui.open('is first');

  await ui.screenshot();
});

test('allows to use more than one describe', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, describe, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run([
      [
        describe('First group', [it('is first', { render: () => 'is first' })]),
        describe('Second group', [
          it('is second', { render: () => 'is second' }),
        ]),
      ],
    ]);
  });

  await ui.screenshot();

  await ui.open('First group');

  await ui.screenshot();

  await ui.open('Second group');

  await ui.screenshot();

  await ui.open('is second');

  await ui.screenshot();
});

test('allows to nest describe', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, describe, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run([
      [
        describe('Group', [
          describe('SubGroup', [
            it('is second', { render: () => 'is second' }),
          ]),
          it('is first', { render: () => 'is first' }),
        ]),
      ],
    ]);
  });

  await ui.screenshot();

  await ui.open('Group');

  await ui.screenshot();

  await ui.open('SubGroup');

  await ui.screenshot();

  await ui.open('is second');

  await ui.screenshot();
});

test('allows to use story factories', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, each, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      each(['first', 'second', 'third'], (place) =>
        it(`is ${place}`, { render: () => `is ${place}` }),
      ),
    );
  });

  await ui.screenshot();

  await ui.open('is first');

  await ui.screenshot();
});

test('allows to use each with describe', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, each, it, describe } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      each(['first', 'second', 'third'], (place) =>
        describe(place, [it(`is ${place}`, { render: () => `is ${place}` })]),
      ),
    );
  });

  await ui.screenshot();

  await ui.open('first');

  await ui.screenshot();

  await ui.open('is first');

  await ui.screenshot();
});

//   ui(
//     'also allows to nest describe',
//     desktop()
//       .stories(({ it, each, describe }) => [
//         each(['first', 'second', 'third'], (place) =>
//           describe(place, [it(`is ${place}`, { render: () => `is ${place}` })]),
//         ),
//       ])
//       .actor()
//       .open('First')
//       .open('is first')
//       .screenshot(),
//   );
// }