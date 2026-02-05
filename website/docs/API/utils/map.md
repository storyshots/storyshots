---
sidebar_position: 1
---

# map {#map}

Transforms the [story](/specification/requirements/borders) attributes:

```ts
map(stories, (story) => ({
  ...story,
  // Add an initial action for each story
  act: (actor, config) => story.act(actor.do(login()), config),
}));
```

You can modify any story property:

```ts
map(stories, (story) => ({
  ...story,
  // Fine-tune the external environment
  arrange: (externals, config) =>
    withDarkTheme(story.arrange(externals, config)),
}));
