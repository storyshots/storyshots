---
sidebar_position: 8
---

# @storyshots/next

Implements the [`client`](/specification/arch#ipreviewclient) preview and [`app server`](/specification/arch#appserverfactory) for Next.js applications.

To integrate, follow these steps:

## Externals {#externals}

Define the basic contracts for external dependencies:

```ts
export type Externals = {
  // In tests, the getPosts function is mocked
  getPosts(): Promise<Post[]>;
};
```

## createStoryFactories {#createstoryfactories}

Link base factories with the `Externals` type and specify default implementations:

```ts
import { createStoryFactories } from '@storyshots/next';
// Describes testable dependencies
import { Externals } from '@/storyshots/arrangers';

// Initialize story factories and utilities
export const { it, describe, each, createOnStorySwitch } = createStoryFactories<Externals>({
  // Define default behavior for external dependencies
  createExternals: () => ({ getPosts: async () => [] }),
  // Mark methods for call logging
  createJournalExternals: (externals) => externals,
});
```

:::note
Default factories are described in [this section](/modules/react#externalsfactory).
:::

## createOnStorySwitch {#createonstoryswitch}

Using a special switch function, define the dependency substitution mechanism:

```ts
import { stories } from '@/storyshots/stories';

// createOnStorySwitch ties factories to defined stories
const onStorySwitch = createOnStorySwitch(stories);

// Then, define two initialization instructions for dependencies
const getPosts = onStorySwitch({
  // In test environment, use special behavior
  onStory: (externals) => externals.getPosts,
  // In real environment, execute actual request
  otherwise: () => () => fetch('...'),
});
```

:::warning
`createOnStorySwitch` should be used only for substituting dependencies at main entry points to avoid
leaking test dependencies.
:::

## createStoryRootComponent {#createstoryrootcomponent}

Link the `Root` component with the defined stories:

```tsx title="Root.tsx"
'use client';

import { createStoryRootComponent } from '@storyshots/next/client';

import { stories } from '@/storyshots/stories';

export const Root = createStoryRootComponent(stories);
```

Next, connect the component as the root:

```tsx
import React from 'react';
import { Root } from '@/storyshots/Root';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
```

## ModeInjector {#modeinjector}

Next, connect the `ModeInjector`:

```tsx
import React from 'react';
import { Root } from '@/storyshots/Root';
import { ModeInjector } from '@storyshots/next/client';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <head>
        {/* Must run before any other CSR code in the project */}
        <ModeInjector />
      </head>
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
```

## createNextPreview {#createnextpreview}

Next, connect the app server:

```ts
import { ManagerConfig } from '@storyshots/core/manager';
import { createNextPreview } from '@storyshots/next/preview';

export default {
  preview: createNextPreview(),
  /* ... */
} satisfies ManagerConfig;
```

## extendNextConfig {#extendnextconfig}

Extend the Next.js configuration:

```ts
import type { NextConfig } from 'next';
import { extendNextConfig } from '@storyshots/next/preview';
import path from 'node:path';

const nextConfig: NextConfig = extendNextConfig({
  // Path to the file exporting stories
  storiesRoot: path.join(process.cwd(), 'storyshots', 'stories'),
  config: {
    // Original Next.js configuration
  },
});

export default nextConfig;
```

:::note
`extendNextConfig` excludes test code from production artifacts.
:::

After this, you can define [stories](/specification/requirements/borders) as usual:

```ts
[
  it('shows empty posts', {}),
  it('shows few posts', {
    arrange: (externals) => ({ ...externals, getPosts: async () => createFewPostsStub() })
  }),
  // ... //
];
```

## createSharedState {#createsharedstate}

Allows emulating stateful behavior in stories:

```ts
it('allows to create post', {
  arrange: (externals) => {
    // State will be identical regardless of runtime functions
    const posts = createSharedState<Post[]>('posts', []);
    
    return {
      ...externals,
      createPost: (body) => posts.update((all) => [...all, { ...body, id: all.length }]),
      getPosts: () => posts.get()
    };
  }
});
```

:::note
`createSharedState` creates shared state for both browser and server environments, but isolates data within the context of a given story.
:::

## Extensions {#extensions}

`@storyshots/next` extends the [it](/API/factories/it) factory with the following features:

### at {#at}

Takes the starting `url` for the story:

```tsx
[
  it('renders home page', {
    // Opens the app at the root URL (default behavior)
    at: '/',
  }),
  it('renders products', {
    // Immediately opens the products list
    at: '/products',
  })
];
```

### arrange {#arrange}

Prepares external dependencies for the story.

This function is used to set up the environment before running the story.

```ts
it('...', {
  arrange: (externals) => ({
    ...externals,
    // Set specific behavior for the method in this story
    getUser: async () => ({ name: 'John Doe', age: 25 }),
  }),
});
```

Accepts [story configuration](/API/test-components/story-config) as a second argument.

Can also be used to mark methods for logging via [Journal](/API/test-components/story-config#journal):

```ts
it('...', {
  arrange: (externals, { journal }) => ({
    ...externals,
    getUser: journal.asRecordable('getUser', externals.getUser),
  }),
});
```

:::note
`journal.record` and `journal.asRecordable` work only with async functions.
:::

Also used for storing temporary state within the story context:

```ts
it('...', {
  arrange: (externals) => {
    // count will be preserved within the running story context
    const count = createSharedState('count', 0);

    return {
      increment: () => count.update(value => value + 1),
      get: () => count.get(),
    };
  },
});
```
