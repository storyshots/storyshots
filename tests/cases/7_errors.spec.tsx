import { test } from '../fixtures/ui';

test('shows an error dedicated to passed story', async ({
  ui,
  page,
}) => {
  await ui.change(({ createPreviewApp, finder }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        act: (actor) => actor.click(finder.getByText('Click')),
        render: () => (
          <>
            <button>Click</button>
            <button>Click</button>
          </>
        ),
      }),
    );
  });

  await ui.run('is a story');

  await ui.screenshot();

  await page.getByLabel('Progress').click();

  await ui.screenshot();

  // It is important to see that nothing is happening on click
  await page.getByText('[desktop]').click();

  await ui.screenshot();
});

test('shows several messages', async ({ ui, page }) => {
  await ui.change(({ createPreviewApp, finder }) => {
    const { run, it, describe } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    const error = (title: string) =>
      it(title, {
        act: (actor) => actor.click(finder.getByText('Click')),
        render: () => (
          <>
            <button>Click</button>
            <button>Click</button>
          </>
        ),
      });

    run(describe('Group', [error('is first'), error('is second')]));
  });

  await ui.run('Group');

  await ui.screenshot();

  await page.getByLabel('Progress').click();

  // TODO: Add panel scroll test (to verify all errors are being displayed correctly)
  await ui.screenshot();
});

test('shows an act error', async ({ ui, page }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        act: () => {
          throw new Error('Act error');
        },
      }),
    );
  });

  await ui.run('is a story');

  await ui.screenshot();

  await page.getByLabel('Progress').click();

  await ui.screenshot();
});

test('shows an arrange error', async ({ ui }) => {
  await ui.change(({ createPreviewApp }) => {
    const { run, it } = createPreviewApp({
      createExternals: () => ({}),
      createJournalExternals: (externals) => externals,
    });

    run(
      it('is a story', {
        arrange: () => {
          throw new Error('Arrange error');
        },
      }),
    );
  });

  await ui.open('is a story');

  await ui.screenshot();
});
