---
sidebar_position: 4
---

# @storyshots/web-api-mocks

Replaces `Date`, timers, and local storage with their [testable counterparts](/specification/requirements/query)
through an [invasive method](/patterns/replace#mocking-through-side-effects).

## install {#install}

Replaces non-deterministic browser APIs. Returns a [Clock](/modules/web-api#clock).

```ts
import { install } from '@storyshots/web-api-mocks';

// Freezes time on the page at 13.01.2024 12:00
export const clock = install({ now: new Date(2024, 0, 13, 12) });
```

:::warning Attention
Must be called before any other code on the page executes.
:::

## clock {#clock}

Time control object.

Operates under the following rules:

- The date remains fixed and does not change over time.
- Timers (`setTimeout`, `setInterval`) on the page execute normally.

:::tip
`clock` is available on the global `window` object, making it usable in [`exec`](/API/test-components/actor#exec).
:::

### tick {#tick}

Advances time forward by the specified number of ms.

Consider the following behavior:

```ts
// Notification closes after 5 seconds
setTimeout(() => closeNotification(), 5_000);
```

To avoid waiting for 5 seconds in the history, use the special `tick` method:

```ts
it('closes notification', {
  act: (actor) =>
    actor
      .screenshot('NotificationShown')
      // Fast-forward 5 seconds
      .exec(() => window.clock.tick(5_000))
      .screenshot('NotificationHidden'),
});
```

:::note
The method affects only timers; the current date remains unchanged. See [unfreeze](/modules/web-api#unfreeze)
:::

### setSystemTime {#setsystemtime}

Sets the current date:

```ts
it('...', {
  arrange: (externals) => {
    // For this story, the date will be set to 13.01.2024
    clock.setSystemTime(new Date(2024, 0, 13));

    return externals;
  },
});
```

:::note
The method affects only the current date; timers are not recalculated.
:::

### unfreeze {#unfreeze}

Unfreezes the current date:

```ts
it('...', {
  arrange: (externals) => {
    // For this story, the date will change over time
    clock.unfreeze();

    return externals;
  },
});
```

:::warning Attention
The `unfreeze` function effectively restores natural time flow on the page, partially undoing the effects
of `@storyshots/web-api-mocks`.

Use only in rare cases, for example when using [`debounce`](https://lodash.com/docs/4.17.15#debounce).
Otherwise, it is not recommended.
:::

## State {#state}

`@storyshots/web-api-mocks` also replaces local storage with in-memory storage that persists data temporally.

```ts
// This write will be automatically cleared when a new story runs
localStorage.setItem('token', '...');
```

:::note
`IndexedDB` is not replaced by this module.
:::
