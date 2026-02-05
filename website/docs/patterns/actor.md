---
sidebar_position: 3
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Actor {#actor}

Describing an actor is an important aspect of stories in `storyshots`. With the right approach, you can significantly simplify tests and refactoring across the project.

## Semantic Selectors {#semantic-selectors}

<MetricsTip improves={[Metric.RefactoringAllowance, Metric.Maintainability]} />

The second bottleneck after stubs is the `act` function. Describing interface interaction instructions can easily increase the coupling of stories to implementation details, making tests more fragile:

<p style={{ color: 'red' }}>Instead of this:</p>

```tsx
it('allows to delete product', {
  act: (actor) =>
    actor.click(
      finder.locator('div.user-card div.button').getByText('Delete'),
    ),
});
```

In this case, the test "knows" about the internal `DOM` structure.

<p style={{ color: 'green' }}>Do this instead:</p>

```tsx
it('allows to delete product', {
  act: (actor) => actor.click(finder.getByRole('button', { name: 'Delete' })),
});
```

Semantic interface labeling helps encapsulate implementation details of the interface from the stories.

:::note
Exceptions are components from third-party libraries that are not always amenable to sufficient extension.
:::

It is recommended to prefer selectors that operate on user-visible attributes. Mostly, these are visible text and roles.

## data-testid Selectors {#data-testid-selectors}

There are techniques that assume a different abstraction approach—namely, using special test indicators:

```tsx
<button data-testid="delete-user-button">Delete</button>
```

```tsx
it('allows to delete product', {
  act: (actor) => actor.click(finder.getByTestId('delete-user-button')),
});
```

### Advantages {#advantages}

The advantages of this approach include the fact that stories become even more abstracted from specific interface implementation details—and even from parts of its _observable behavior_.

:::tip
The easiest way to understand this is through an example:

`getByRole('button', { name: 'Delete' })` is directly tied to the button's text. If the text changes, the selector must be manually adjusted. The same applies to the role.

`data-testid` is insensitive to such changes, and the selector remains unchanged. This makes the test more resilient to changes in the application under test.
:::

Also, due to its manageability, `data-testid` makes TDD techniques easier to apply. All identifiers and interactions can be thought through and written in advance, before the page interface is even developed:

```typescript
it('allows to delete multiple products', {
  act: (actor) =>
    actor
      .click(finder.getByTestId('product-0-checkbox'))
      .click(finder.getByTestId('product-1-checkbox'))
      .click(finder.getByTestId('delete-selected-button'))
      .click(finder.getByTestId('confirm-delete-button')),
});
```

:::note
It's hard to predict the semantics of page elements before they appear. With `data-testid`, it's simpler because their content and value are defined by the developer, not the system.
:::

:::tip
`data-testid` can also be used by external teams, such as automation engineers.
:::

### Disadvantages {#disadvantages}

The following drawbacks can be noted:

- Although this technique makes tests more resilient, careless use can reduce regression protection because part of the semantic verification of the interface is lost.
- `data-testid` pollutes the main application code and requires additional developer time.
- On average, tests using `data-testid` are harder to read than similar scenarios using semantic selectors.

## Component-Based Approach {#component-based-approach}

<MetricsTip improves={[Metric.Maintainability]} />

Any UI interface can be broken down into components.

:::tip
A component is a page element that encapsulates presentation, behavior, and interaction model.
:::

Such elements are especially useful in programming, as they can be reused across different pages without increasing project complexity. `storyshots` further leverages this by providing extension methods for [`actor`](/API/test-components/actor) and [`finder`](/API/test-components/finder):

<p style={{ color: 'red' }}>Instead of this:</p>

```tsx
const stories = [
  it('allows to delete user', {
    /**
     * UserPage uses a standard delete button <button>Delete</button>
     */
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Delete' })),
    render: () => <UserPage />, 
  }),
  it('allows to delete product', {
    /**
     * ProductsPage uses the same button, but developers implemented it differently,
     * for some reason: <div className="button">Delete</div>
     */
    act: (actor) =>
      actor.click(finder.locator('div.button').getByText('Delete')),
    render: () => <ProductsPage />, 
  }),
];
```

Because the same user-facing elements are implemented differently, the interaction instructions in the stories also differ.

<p style={{ color: 'green' }}>Do this instead:</p>

```tsx
/**
 * By using the component-based approach, selectors can also be unified across tests
 */
const button =
  (name: string): FinderTransformer =>
  (finder) =>
    finder.getByRole('button', { name });

const stories = [
  it('allows to delete user', {
    act: (actor) => actor.click(finder.get(button('Delete'))),
    render: () => <UserPage />, 
  }),
  it('allows to delete product', {
    act: (actor) => actor.click(finder.get(button('Delete'))),
    render: () => <ProductsPage />, 
  }),
];
```

You can go further and implement a separate object with selectors based on the component system used in the application:

```ts title="selectors.ts"
declare const button: FinderTransformer;

declare const modal: FinderTransformer;

/* and others */
```

You can extend not only selectors, but entire actions as well:

```ts title="actions.ts"
declare const upload: ActorTransformer;

declare const dismiss: ActorTransformer;

/* and others */
```

By following the component-based approach and using extension methods, you can significantly simplify stories:

```ts
it('allows to remove a user from list', {
  act: (actor) =>
    actor.do(trash('Vasiliy')).screenshot('ConfirmationWindow').do(confirm()),
});
```
