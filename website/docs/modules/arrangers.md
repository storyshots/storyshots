---
sidebar_position: 5
---

# @storyshots/arrangers

Functions and utilities for working with `externals` during the `arrange` phase of stories.

## createArrangers {#create-arrangers}

Creates core utilities and binds them to the base `externals` type:

```ts
import { createArrangers } from '@storyshots/arrangers';

interface IExternals {
  analytics: {
    log(event: string): void;
  };
  business: {
    getBalanceAt(date: number): Promise<number>;
    applyCV(form: unknown): Promise<void>;
  };
  route: string;
}

const utils = createArrangers<IExternals>();
```

## set {#set}

Sets a value for the specified key:

```ts
it('...', {
  // The getBalanceAt method now has a different implementation
  arrange: set('business.getBalanceAt', async () => 100_000),
});
```

## record {#record}

Makes the provided methods trackable:

```ts
it('...', {
  // Calls to getBalanceAt are now recorded in the log
  arrange: record('business.getBalanceAt'),
});
```

Also accepts an implementation:

```ts
it('...', {
  // In addition to recording, the behavior is also set
  arrange: record('business.getBalanceAt', async () => 100_000),
});
```

## transform {#transform}

Transforms the return value of a method:

```ts
it('...', {
  arrange: transform('business.getBalanceAt', (balance) => balance * 2),
});
```

:::note
Works only with async functions. For all others, use [compose](/modules/arrangers#compose)
:::

## compose {#compose}

Sets a new value based on the current one:

```ts
it('...', {
  arrange: compose('route', (path) => (path === '/login' ? '/' : path)),
});
```

## focus {#focus}

Focuses `arrangers` on a nested property:

```ts
import { createArrangers } from '@storyshots/arrangers';

interface IExternals {
  repositories: {
    UserRepository: {
      getUser(): Promise<void>;
    };
  };
  route: string;
}

const utils = createArrangers<IExternals>();

// Create arrangers focused on repositories.
export const repository = utils.focus('repositories');
```

The created utilities can then be used in stories as follows:

```ts
it('...', {
  // The property path is now shortened
  arrange: repository.set('UserRepository.getUser', async () =>
    createAdminUserStub(),
  ),
});
```

## arrange {#arrange}

Function that combines multiple `arrangers` into one:

```ts
it('...', {
  arrange: arrange(
    set('business.getBalanceAt', () => 100_000),
    record('analytics.log'),
  ),
});
```

`arrange` can be nested within each other:

```ts
it('...', {
  arrange: arrange(withZeroBalance(), withApplyCVSuccess()),
});

function withZeroBalance() {
  return set('business.getBalanceAt', () => 0);
}

function withApplyCVSuccess() {
  return arrange(
    set('business.applyCV', async () => 'success'),
    record('business.applyCV'),
  );
}
```

Inline `arrange` can also be defined:

```ts
it('...', {
  arrange: arrange(
    set('business.getBalanceAt', () => 0),
    // Can be extracted into a separate function
    (externals) => {
      clock.set(new Date(/* ... */));

      return externals;
    },
  ),
});
```

## resolves {#resolves}

Creates a function that returns `Promise.resolve` with the provided value:

```ts
it('...', {
  arrange: set('business.getBalanceAt', resolves(0)),
});
```

## rejects {#rejects}

Creates a function that returns `Promise.reject` with the provided value:

```ts
it('...', {
  arrange: set('business.getBalanceAt', rejects('Balance not found')),
});
```
