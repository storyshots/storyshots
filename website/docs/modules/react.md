---
sidebar_position: 2
---

# @storyshots/react

Implements the [`preview client`](/specification/arch#ipreviewclient) for `react` applications:

```ts
import { createPreviewApp } from '@storyshots/react';

// Initialize preview
export const { it, describe, each, run } = createPreviewApp({
  // Define default behavior for external dependencies
  createExternals,
  // Mark methods to be logged by default
  createJournalExternals,
});

// Describe stories
const stories = [describe('...', it('...'))];

// Run the preview client
run(stories);
```

## ExternalsFactory {#externalsfactory}

Allows defining default behavior and logging for external dependencies of the application.

---

## createExternals {#createexternals}

The main factory that initializes external dependencies of the application.
Accepts [StoryConfig](/API/test-components/story-config).

```ts
createPreviewApp({
  createExternals: () => {
    // This behavior will be used by default in stories
    getUser: async () => DEFAULT_USER;
  },
  /* ... */
});
```

### createJournalExternals {#createjournalexternals}

Marks functions in the `externals` object that should be [tracked](/specification/requirements/command#verification-method) by default. Once a function is marked as recordable, this action cannot be undone.

Accepts the final `externals` and [StoryConfig](/API/test-components/story-config).

```ts
createPreviewApp({
  createJournalExternals: (externals, config) => ({
    ...externals,
    getUser: config.journal.asRecordable(externals.getUser),
  }),
});
```

## run {#run}

In addition to the [test factory](/API/factories/it), returns a `run` function required to start the preview. Accepts an array of [stories](/specification/requirements/borders).

```tsx
const { run, it } = createPreview(/* ... */);

run([
  it('works', {
    render: (externals) => <App externals={externals} />, 
  }),
]);
```

## Extensions {#extensions}

`@storyshots/react` extends the [it](/API/factories/it) factory with the following methods:

### render {#render}

Represents the behavior under test (specifically for `react` applications, returns the component tree for rendering).

Accepts `externals` and [StoryConfig](/API/test-components/story-config):

```tsx
it('...', {
  // Renders the UserProfile component using prepared data from externals.
  render: (externals, config) => <UserProfile externals={externals} />, 
});
```

#### previewing {#previewing}

`@storyshots/react` extends `StoryConfig` with `previewing` property that specifies the mode in which the story is
running.

- `true`: The story is running in [preview](/ui/#preview) mode.
- `false`: The story is executed as a test in a background agent.

:::note
This property is useful for controlling the [external environment](/specification/requirements/query). For example, animations should be enabled in preview mode (for more intuitive development), but disabled in test execution mode to avoid nondeterministic behavior.
:::

### arrange {#arrange}

Prepares external dependencies for a story.

This function is used to set up the environment before running a story.

```ts
it('...', {
  arrange: (externals) => ({
    ...externals,
    // Set specific behavior for the method in this story.
    getUser: async () => ({ name: 'John Doe', age: 25 }),
  }),
});
```

Accepts [story configuration](/API/test-components/story-config) as the second argument.

Can also be used to mark methods for logging via [Journal](/API/test-components/story-config#journal):

```ts
it('...', {
  arrange: (externals, { journal }) => ({
    ...externals,
    getUser: journal.asRecordable('getUser', externals.getUser),
  }),
});
```

Can also be used to store temporary state within the story context:

```ts
it('...', {
  arrange: (externals) => {
    // count will be preserved in the running story context.
    const count = 0;

    return {
      increment: () => (count += 1),
      get: () => count,
    };
  },
});
```
