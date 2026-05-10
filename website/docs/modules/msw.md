---
sidebar_position: 6
---

# @storyshots/msw-externals

Replaces server calls using a [non-invasive method](/patterns/replace#mocking-through-side-effects) via the [`msw`](https://github.com/mswjs/msw) library.

## Endpoints {#endpoints}

Stores metadata about overridden endpoints.

Usage:

```ts
import { Endpoints } from '@storyshots/msw-externals';

type Externals = {
  // Metadata is defined in the general Endpoints type and stored in externals.
  endpoints: Endpoints;
};
```

As a default value in the `preview` zone, specify an empty object:

```ts
export const { run, it, describe } = createPreviewApp<Externals>({
  createExternals: () => ({ endpoints: {} as Endpoints }),
  createJournalExternals: (externals) => externals,
});
```

Then endpoints are registered in `Endpoints` using the [`endpoint`](/modules/msw#endpoint) method.

## createMSWArrangers {#createmswarrangers}

Creates arrangers utilities based on [`@storyshots/arrangers`](/modules/arrangers):

```ts
import { createArrangers } from '@storyshots/arrangers';
import { createMSWArrangers, Endpoints } from '@storyshots/msw-externals';

// Create base arrangers functions
const arrangers = createArrangers<Endpoints>();

const msw = createMSWArrangers(
  // Specify the path to the Endpoints storage in externals
  arrangers.focus('endpoints'),
);
```

## endpoint {#endpoint}

Adds a new endpoint to the metadata:

```ts
it('...', {
  arrange: endpoint('findPetsByStatus', {
    url: '/api/pet/findByStatus',
    // handle is optional
    handle: () => [],
  }),
});

declare module '@storyshots/msw-externals' {
  // In addition to describing the endpoint, you must augment the main type
  interface Endpoints {
    findPetsByStatus: Endpoint<FindPetsByStatusApiResponse>;
  }
}
```

:::note
To avoid duplicating `endpoint` definitions, you can extract them into a separate function:

```ts
it('...', {
  arrange: setup(),
});

function setup() {
  return endpoint('findPetsByStatus', {
    url: '/api/pet/findByStatus',
    handle: () => [],
  });
}

declare module '@storyshots/msw-externals' {
  interface Endpoints {
    findPetsByStatus: Endpoint<FindPetsByStatusApiResponse>;
  }
}
```

:::

## record {#record}

Makes the provided methods trackable, and can also accept an implementation:

```ts
it('...', {
  arrange: arrange(
    setup(),
    // Method calls are now recorded in the journal
    record('findPetsByStatus'),
    // Behavior is also defined for this method
    record('getStatuses', () => [
      /* ... */
    ]),
  ),
});
```

## handle {#handle}

Allows replacing the behavior of an existing endpoint:

```ts
it('...', {
  arrange: arrange(
    setup(),
    // The behavior of findPetsByStatus is now different
    handle('findPetsByStatus', () => createFewPetsStub()),
  ),
});
```

## transform {#transform}

Transforms the return value of a method:

```ts
it('...', {
  arrange: transform('findPetsByStatus', (pets) => pets.slice(0, 2)),
});
```

:::note
Works only with async functions. For all others, use [compose](/modules/arrangers#compose)
:::

:::tip
`endpoint`, `record`, and `handle` are the same kind of arrangers utilities as those described in `@storyshots/arrangers`.

The same rules apply, and they can be freely combined with each other.
:::

## toRequestHandlers {#torequesthandlers}

Converts `Endpoints` into native `RequestHandler`:

```ts
import { setupWorker } from 'msw/browser';

// Convert metadata into RequestHandler[]
const handlers = toRequestHandlers(externals.endpoints);

// Then you can connect msw to the app as usual
setupWorker(...handlers).start()
```

## params {#params}

Getter for request parameters:

```ts
it('...', {
  arrange: arrange(
    setup(),
    handle('findPetsByStatus', (args) => params(args).status === 'active' ? createPetsStub() : []),
  ),
});
```

## query {#query}

Getter for query parameters of the request:

```ts
it('...', {
  arrange: arrange(
    setup(),
    handle('findPetsByStatus', (args) => query(args).page === '0' ? createPetsStub() : []),
  ),
});
```

## body {#body}

Getter for the JSON body of the request:

```ts
it('...', {
  arrange: arrange(
    setup(),
    handle('createPet', (args) => body(args).title === '' ? createErrorResponse() : createSuccessResponse()),
  ),
});
```

## native {#native}

Allows throwing native `msw` exceptions:

```ts
it('...', {
  arrange: arrange(
    setup(),
    handle('findPetsByStatus', () =>
      native(new HttpResponse(null, { status: 500 })),
    ),
  ),
});
```

:::warning Important
`native` throws an exception, so it cannot be extended via `transform`.
:::