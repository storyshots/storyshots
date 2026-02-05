---
sidebar_position: 1
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Stories {#stories}

A story is the basic unit of `storyshots`. It captures the application in a specific state, describing the external environment and user actions.

## Story Splitting {#story-splitting}

<MetricsTip improves={[Metric.Maintainability, Metric.Speed]} />

`storyshots` provides multiple tools for splitting test scenarios. One of them is the use of semantic `describe` groups.

A large number of scenarios grouped together not only increases file size but also complicates maintenance due to differing responsibilities.

:::note
Responsibility is the reason why code might be changed. If two different functions are changed at the same time and for the same reason, then and only then are their responsibilities considered **equal**.
:::

<p style={{ color: 'red' }}>Instead of this:</p>

```ts
const stories = [
  it('shows list of products' /* ... */),
  it('allows to add a product' /* ... */),
  it('rejects unauthorized access to a store' /* ... */),
];
```

<p style={{ color: 'green' }}>Do this:</p>

```ts
const stories = [
  describe('Products', [
    it('shows list of products' /* ... */),
    it('allows to add a product' /* ... */),
  ]),
  describe('Auth', [it('rejects unauthorized access to a store' /* ... */)]),
];
```

:::tip
Stories should be decomposed so that when they are later edited (or read), they contain as few redundant elements as possible.
:::

- `describe` blocks are usually domain names, subfunctions, or responsibilities. It is recommended to name them with a short CamelCase phrase (starting with a capital letter).
- `it` blocks are specific stories, read as "This application (it) [story text]".

:::tip

```ts
it('allows for user to logout');
```

Reads as: "This application allows the user to log out.".
:::

## Story Merging {#story-merging}

<MetricsTip improves={[Metric.Speed]} degrades={[Metric.Maintainability]} />

`storyshots` allows making multiple screenshots within a single story instead of one per story:

<p style={{ color: 'red' }}>Instead of this:</p>

```ts
describe('Login', [
  it('shows disabled password initially'), // Test simply takes a screenshot of the initial form state
  it('allows to fill login field', {
    // Checks the ability to fill the field
    act: (actor) => actor.fill(finder.getByPlaceholder('Login'), 'Login'),
  }),
  it('allows to enter credentials', {
    // Checks the ability to fill the entire form
    act: (actor) =>
      actor
        .fill(finder.getByPlaceholder('Login'), 'Login')
        .fill(finder.getByPlaceholder('Password'), '1235'),
  }),
]);
```

<p style={{ color: 'green' }}>Do this:</p>

```ts
it('allows to enter credentials', {
  // Story checks all states at once
  act: (actor) =>
    actor
      .screenshot('Initial')
      .fill(finder.getByPlaceholder('Login'), 'Login')
      .screenshot('PasswordEnabled')
      .fill(finder.getByPlaceholder('Password'), '1235'),
});
```

Initially, there were three separate stories, each checking a different form state. Thanks to intermediate screenshots, the total number of tests was reduced, thus lowering the overall execution time. Meanwhile, regression protection remained unaffected.

:::note
The question of test decomposition is quite complex:

- On one hand, there should be as few tests as possible, because otherwise the codebase grows, execution time increases, and checks may duplicate each other.
- On the other hand, the larger the test, the harder it is to control scenario coverage, and the greater the risk of mixing responsibilities—precisely what the [story splitting](/patterns/stories#story-splitting) section aims to prevent.

In other words, it's about _balance_.

General recommendation: start simple. In most cases, this means writing one large story. Later, if maintenance becomes difficult, break it into smaller, atomic, and independent units.
:::

## Story Priorities {#story-priorities}

<MetricsTip improves={[Metric.Maintainability, Metric.Speed]} degrades={[Metric.RegressionProtection]} />

Over time, the number of stories in a project will grow, along with their execution time. To mitigate this issue, you can declare priorities using [story attributes](/API/factories/it#storyattributes):

```ts title="extend-module.ts"
declare module '@storyshots/core' {
  interface StoryAttributes<TArgs> {
    secondary?: true;
  }
}
```

Then, mark tests by priority:

```ts
const stories = [
  // It's critical that login works in the app
  it('allows to login'),
  // Meanwhile, theme selection is secondary
  it('allows to set dark theme', {
    secondary: true,
  }),
];
```

Next, set a separate mode to run only high-priority stories:

```ts
run(filter(stories, (story) => not(story.secondary)));
```

:::tip
To avoid accidentally excluding necessary tests, it's recommended to set high priority as the default for stories.
:::

## Universal Render {#universal-render}

<MetricsTip improves={[Metric.Maintainability]} />

`@storyshots/react` allows defining a `render` function per story, which may suit testing UI libraries:

```tsx
const renders = it;

const buttonStories = [
  renders('primary button', {
    render: () => <Button type="primary" />, 
  }),
  renders('primary disabled button', {
    render: () => <Button type="primary" disabled />, 
  }),
];
```

However, for testing end-user applications, this approach is impractical. Instead, it's recommended to define a default `render`:

```tsx title="preview.tsx"
export const { run, it } = createPreviewApp(/* ... */);
```

```tsx title="index.tsx"
run(
  map(stories, (story) => ({
    // By default, the app's root component will be rendered
    render: (externals) => <App externals={externals} />, 
    ...story,
  })),
);
```

```tsx title="stories.tsx"
export const stories = [
  it('...', {
    /**
     * Defining render in the story is no longer necessary.
     */
  }),
];
```
