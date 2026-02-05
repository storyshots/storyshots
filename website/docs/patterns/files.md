---
sidebar_position: 7
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# File Structure {#file-structure}

Tests are code too, so they require just as much attention to detail — from internal function design to external file structure.

## Test Location {#test-location}

<MetricsTip improves={[Metric.RefactoringAllowance]} />

It's better to place stories and their associated infrastructure away from the main codebase. This creates a clear boundary between the application and its tests.

:::tip
Tests can and should influence the codebase, but only in strictly defined aspects — specifically in _architecture_. The application must be sufficiently extensible, especially in terms of [*queries*](/specification/requirements/query) and [*commands*](/specification/requirements/command), to be testable.
:::

<p style={{ color: 'red' }}>Instead of this:</p>

```plaintext
project/
├── src/
│   ├── User/
│   │   ├── index.tsx
│   │   └── stories.tsx <-- Tests are placed next to the code they test
│   ├── api/
│   │   ├── userRepository.ts
│   │   └── mockUserRepository.ts <-- Mocks included here too
│   └── index.ts
└── package.json
```

<p style={{ color: 'green' }}>Do this:</p>

```plaintext
project/
├── src <-- Main application code
├── storyshots/ <-- Tests and associated infrastructure
│   ├── userStories.ts
│   ├── mockUserRepository.ts
│   └── index.ts
└── package.json
```

:::tip
Baseline artifacts — logs and snapshots — can be placed in the root of the repository, as they are often used as documentation sources:

```plaintext
project/
├── screenshots <-- Snapshots
├── records <-- Logs
├── src
├── storyshots
└── package.json
```
:::

## Component Types {#component-types}

<MetricsTip improves={[Metric.Maintainability]} />

In tests, it's sufficient to distinguish the following components:

Environment setup component:

```ts
describe('User', [
  it('allows to login', {
    arrange: setup(),
    /* ... */
  }),
  it('allows to logout', {
    arrange: setup(),
    /* ... */
  }),
  it('allows to change password', {
    arrange: setup(),
    /* ... */
  }),
]);

// All stories set up the environment identically, so the setup function is such a component
function setup() {
  /* ... */
}
```

Partial environment modification functions:

```ts
describe('User', [
  it('allows to login', {
    arrange: arrange(setup(), unauthorized()),
    /* ... */
  }),
  it('allows to logout', {
    arrange: arrange(setup(), authorized()),
    /* ... */
  }),
  it('allows to change password', {
    arrange: arrange(setup(), authorized()),
    /* ... */
  }),
]);

/**
 * Despite shared initialization logic, stories may require partial adjustments.
 * These functions belong to this category.
 */
function authorized() {
  /* ... */
}

function unauthorized() {
  /* ... */
}

/* ... */
```

Interface interaction and actor-related functions:

```ts
describe('User', [
  it('allows to login', {
    arrange: arrange(setup(), unauthorized()),
    act: (actor) => actor.do(enterCredentials()).do(submit()),
    /* ... */
  }),
  it('allows to logout', {
    arrange: arrange(setup(), authorized()),
    act: (actor) => actor.click(finder.get(button('Logout'))),
    /* ... */
  }),
  it('allows to change password', {
    arrange: arrange(setup(), authorized()),
    /* ... */
  }),
]);

// Functions working with actors and selectors belong to this component category
function button() {
  /* ... */
}

function enterCredentials() {
  /* ... */
}

function submit() {
  /* ... */
}

/* ... */
```

Stubs:

```ts
function authorized() {
  /* uses createUserStub */
}

function unauthorized() {
  /* uses create401ErrorStub */
}

// POJO factories belong to the stubs category
function createUserStub() {
  /* ... */
}

function create401ErrorStub() {
  /* ... */
}

/* ... */
```

When decomposing a story, the structure may look like this:

```plaintext
productsStories.ts
utils // Local components
├── arrangers.ts // Local environment setup
├── setup.ts // Common environment setup
├── stubs.ts // Stubs
└── actors.ts // Interface interaction
```

:::tip
If further decomposition is needed at the component level, files can be aggregated under a folder with the same name:

```plaintext
stubs/
├── createUserStub.ts
├── createRoleStub.ts
└── index.ts // Re-export file
```
:::

## Component Placement {#component-placement}

<MetricsTip improves={[Metric.Maintainability]} />

The placement of elements within stories (and generally within the `storyshots` infrastructure) should minimize the distance between related entities:

**Single file** — if an element, such as a stub, is used in only one story, then they should be stored in the same file.

:::tip
If a file exceeds readability thresholds, prioritization should be given to splitting it.
:::

**Shared file** — if an element is used across related but different story files (same domain), it should be placed in a separate file located equidistant from the tests.

This file is typically placed at the nearest common folder level:

```plaintext
stories/
├── userStories.ts // Client #1
├── producStories/
│   └── removeProductsStories.ts // Client #2
├── utils/
│   └── stubs.ts // <-- Shared component
└── index.ts
```

**Global file** — if a component is used across multiple unrelated stories, it should be moved to the highest level within `storyshots`.

```plaintext
storyshots/
├── utils/
│   ..... // Global components used across unrelated stories.
└── stories/
    ├── userStories.ts
    └── producStories/
        ├── utils // Local components
        │   ..... // Used only within producStories folder
        ├── productRemoveStories.ts
        └── productsStories.ts
```

:::tip
Following this methodology makes it easy to understand a component’s responsibility — the higher it appears in the tree, the more clients depend on it, and the harder it becomes to modify directly.
:::
