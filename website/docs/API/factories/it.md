---
sidebar_position: 1
---

# it {#it}

Creates a custom story, allowing you to describe a stage of interaction with the UI and set test parameters.

:::tip
Also supported are other [meta-attributes](/modules/react#extensions) specific to a particular [app client](/specification/arch#appclient).
:::

---

# retries {#retries}

Defines the number of retry attempts in case of failure for an individual story. Accepts a [device](/API/test-components/story-config#device).

```ts
it('...', {
  // Retry the test up to 3 times on failure. Only on mobile devices.
  retries: (device) => (device.name === 'mobile' ? 3 : 0),
});
```

## act {#act}

Describes actions performed in the story using an [actor](/API/test-components/actor). This function emulates user actions such as button clicks, form submissions, and so on.

```ts
it('...', {
  act: (actor) => actor.click(finder.getByText('Sign In')),
});
```

Accepts [story environment](/API/test-components/story-config) as a second argument.

```ts
it('...', {
  // The interface may differ on mobile devices
  act: (actor, { device }) =>
    device.name === 'mobile'
      ? // On phones, a swipe will be performed
        actor.do(swipeProduct())
      : // On desktop, a regular button click
        actor.do(clickOnTrash()),
});
```

## StoryAttributes {#storyattributes}

Public interface for external extensions of the test factory:

```ts
// Declare the interface in the @storyshots/core namespace
declare module '@storyshots/core' {
  // TArg is a generic parameter, typically containing the structure of externals
  interface StoryAttributes<TArg> {
    // Any structures can be used, even functions.
    prop: string;
  }
}

// Configuration now supports the new property.
it('...', {
  prop: 'property value',
});
```

:::tip
`StoryAttributes` combined with story functions enables implementing a wide range of [useful behaviors](/patterns/stories#story-priorities).
:::
