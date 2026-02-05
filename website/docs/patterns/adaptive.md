---
sidebar_position: 8
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Adaptivity {#adaptivity}

Modern UI is often adaptive. `storyshots` accounts for this fact by providing the appropriate API.

## One story for all devices {#one-story-for-all-devices}

<MetricsTip improves={[Metric.RegressionProtection, Metric.RefactoringAllowance, Metric.Maintainability]} degrades={[Metric.Speed]} />

This means that the interface may differ depending on the device on which the application is running:

```ts
it('shows dismissible user removal notice', {
  act: (actor, config) =>
    actor.screenshot('Notice').click(
      /**
       * config contains information about the device on which the test is currently running
       */
      config.device.name === 'desktop'
        ? // On desktop this is a close icon
          finder.getByRole('image', { name: 'close-note' })
        : // On mobile it's just the text "Close"
          finder.getByRole('button', { name: 'Close' }),
    ),
});
```

:::note
Functions `arrange` and `render` also refer to the currently emulated device.
:::

To avoid conditionals, you can make the markup more semantic, thereby making stories less dependent on implementation details:

```ts
it('shows dismissible user removal notice', {
  act: (actor) =>
    actor
      .screenshot('Notice')
      .click(finder.getByRole('button', { name: 'Close notification' })),
});
```

:::note
The same role will be assigned to different implementation elements, making stories more compatible with refactoring.
:::

## One story per device {#one-story-per-device}

<MetricsTip improves={[Metric.RegressionProtection, Metric.Maintainability]} />

The interface in the application may differ so significantly between devices that simple conditionals and semantic markup may not be enough.

In such cases, you can selectively enable stories only for specific devices:

```ts
const usersStories = describe('Users', [
  it('shows nothing when there is no users', {
    /* ... */
  }),
  it('shows users', {
    /* ... */
  }),
  only(
    ['mobile'],
    // In the mobile version, new actions are available
    it('allows to swipe users to delete them', {
      /* ... */
    }),
  ),
]);
```

:::tip
The [`only`](/API/utils/only) method is used to include a story only for specific devices. This can be helpful during active development when functionality is implemented only for one device type.
:::

:::warning Attention
If the interface differences are too large, it is recommended to create separate `storyshots` entry points for different devices:

```ts title="preview/desktop.ts"
// desktopStories is a separate story tree defined specifically for desktop
run(desktopStories);
```

```ts title="preview/mobile.ts"
// mobileStories is a separate story tree defined specifically for mobile
run(mobileStories);
```

Each preview manager will run separately with the device set accordingly, for example for desktop:

```ts title="manager/desktop-ui.ts"
runUI({
  devices: [
    {
      name: 'desktop',
      width: 1480,
      height: 920,
    },
  ],
  /* ... */
});
```

:::

## Device reduction {#device-reduction}

<MetricsTip improves={[Metric.Maintainability, Metric.Speed]} degrades={[Metric.RegressionProtection]} />

UI requirements are growing, just as the variety of devices on which the interface may be displayed is increasing.

This can lead to the desire to test the application on three or more devices:

<p style={{ color: 'red' }}>Instead of this:</p>

```ts
const config = {
  devices: [
    { name: 'desktopXL' /* ... */ },
    { name: 'desktopL' /* ... */ },
    { name: 'desktopS' /* ... */ },
    { name: 'mobileL' /* ... */ },
    { name: 'mobileS' /* ... */ },
    { name: 'tablet' /* ... */ },
  ],
  /* ... */
};
```

While this large number of devices increases overall application coverage, it also requires significant time and resource costs. Instead, you can focus on just a few core devices.

<p style={{ color: 'green' }}>Do this instead:</p>

```ts
const config = {
  devices: [
    { name: 'desktop' /* ... */ },
    { name: 'mobile' /* ... */ },
    { name: 'tablet' /* ... */ },
  ],
  /* ... */
};
```

:::tip
It is not recommended to use more than two devices in `storyshots`.
:::

Another option is to use different execution modes:

**Fast, but shallow** – in this mode, stories run only on a pair of devices:

```ts
run(only(['desktop', 'mobile'], stories));
```

**Complete, but slow** – all test scenarios are executed for all devices:

```ts
run(stories);
```

:::tip
Run fast tests as part of your workflow, while running slow ones overnight.
:::
