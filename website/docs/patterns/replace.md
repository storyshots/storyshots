---
sidebar_position: 4
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Behavior Mocking {#behavior-mocking}

`storyshots` requires mocking components: [*queries*](/specification/requirements/query) and [*commands*](/specification/requirements/command) into stub functions,
so that baseline testing becomes possible.

## Mocking Through Inversion {#mocking-through-inversion}

<MetricsTip improves={[Metric.Maintainability]} degrades={[Metric.RefactoringAllowance]} />

Dependency inversion is one way to mock behavior.

Consider the following example:

```ts
async function placeAnOrder(order: OrderRepository) {
  showLoading('Creating order');

  await order.createOrder();

  hideLoading();

  showMessage('Order was successfully created');
}
```

The `placeAnOrder` function accepts any value implementing the `OrderRepository` interface as an argument.

In real code, the `orderRepository` that makes server calls is passed into `placeAnOrder`:

```ts
placeAnOrder(orderRepository);
```

In the `storyshots` environment, the same function can be used with stubs:

```ts
placeAnOrder(mockOrderRepository);
```

:::note
The behavior of `placeAnOrder` will change, but the function's source code remains identical. This is called _extension_.
:::

### Dependency Inversion {#dependency-inversion}

Using the `OrderRepository` interface, the dependency between `placeAnOrder` and `orderRepository` has been inverted.
This allowed replacing the repository only because `placeAnOrder` no longer depends on `orderRepository` directly.

However, if the implementation of `placeAnOrder` changes:

```ts
async function placeAnOrder(order: OrderRepository) {
  showLoading('Creating order');

  await order.createOrder();
  // New method added
  await order.scheduleDelivery();

  hideLoading();

  showMessage('Order was successfully created');
}
```

Then `orderRepository` must also be updated to satisfy the new interface.

:::note
Interfaces are part of their clients, as it is the users (clients) who dictate the requirements
of the systems (interfaces) they use.
:::

### Dependency Inversion in React {#dependency-inversion-in-react}

Dependency inversion is often accompanied by dependency injection (DI) mechanisms. DI can be divided into two stages:

- Creating dependencies
- Injecting dependencies

React provides its own DI equivalent, called context, where the `Provider` component sets dependencies,
and the `Consumer` allows reading them through the component tree.

:::note
On one hand, this reduces component coupling and increases their flexibility. On the other hand, it reduces opportunities
for static typing.
:::

In this case, you can create a root provider defining replaceable dependencies:

```tsx
type Externals = {
  repositories: {
    /* methods for server calls */
  };
  env: {
    /* methods for working with Web API */
  };
  /* and others */
};

const Context = createContext<Externals | undefined>();

export const Externals: React.FC<
  React.PropsWithChildren<{ externals: Externals }>
> = ({ externals, children }) => {
  return <Context.Provider value={externals}>{children}</Context.Provider>;
};

export const useExternals = () => {
  const externals = useContext(Context);

  if (externals === undefined) {
    throw new Error('Externals dependency is missing');
  }

  return externals;
};
```

Next, declare factories for real and test environments:

```ts
declare function createExternals(): Externals;

declare function createMockExternals(): Externals;
```

:::tip
It is recommended to separate test code from the real environment (see [Test Location](/patterns/files#test-location)).
:::

The entry point for the real environment might look like this:

```tsx
export const Main: React.FC = () => (
  // In the real environment, real externals are used.
  <Externals externals={createExternals()}>
    <App />
  </Externals>
);
```

In tests, `externals` are replaced with test data:

```ts title="preview.ts"
export const { run, it } = createPreviewApp({
  createExternals: createMockExternals,
  createJournalExternals: createJournalExternals,
});
```

```tsx title="run.tsx"
run(
  map(stories, (story) => ({
    render: (externals) => (
      // In the storyshots environment, test dependencies are injected
      <Externals externals={externals}>
        <App />
      </Externals>
    ),
    ...story,
  })),
);
```

### Evaluation {#evaluation}

Advantages of this method:

- **Strictness** – invertible dependencies cannot be used before they are created. This property is obvious
  and additionally enforced by the compiler.
- **Safety** – this method integrates perfectly with TypeScript and ensures maximum correctness at the static level.
- **Influence** – this mocking approach exerts additional influence on the application architecture, making it more extensible
  and adaptive to changes.

Disadvantages:

- **Verbosity** – inversion requires creating a new intermediate entity, an interface.
- **Demanding** – the code must be structured in a way that supports inversion. Libraries, even the most popular ones,
  do not always allow extending their behavior this way.
- **Dependency** – this mocking method more tightly couples tests to the internal structure of the project code,
  complicating refactoring.

:::tip
This mocking method is recommended for new projects with small codebases and still malleable internal structures.
:::

## Mocking Through Side Effects {#mocking-through-side-effects}

<MetricsTip improves={[Metric.RefactoringAllowance]} degrades={[Metric.Maintainability]} />

In addition to explicit mocking through inversion, dependencies can also be replaced by directly modifying them.

Consider the following example:

```ts
const orderRepository = {
  // Server call
  createOrder: () => fetch('...'),
};

async function placeAnOrder() {
  showLoading('Creating order');

  await orderRepository.createOrder();

  hideLoading();

  showMessage('Order was successfully created');
}
```

`placeAnOrder` uses `orderRepository`. To test the function, you can directly replace the repository's behavior:

```ts
// Directly replace the `createOrder` method with a stub.
orderRepository.createOrder = () => {
  /* ... */
};

placeAnOrder();
```

:::note
In `storyshots`, all stories exist in isolated environments, so the impact of such mocking on other tests is eliminated.
:::

### Monkey-Patching in React {#monkey-patching-in-react}

With this type of mocking, it is recommended to use repositories as global singleton objects:

```ts title="repositories.ts"
export const orderRepository = {
  /* ... */
};

export const userRepository = {
  /* ... */
};

export const productRepository = {
  /* ... */
};

/* And other repositories */
```

In a specific component, repositories are used directly by reference:

```ts
export const UserPage: React.FC = () => {
  const response = useQuery(userRepository.getUser);

  /* ... */
};
```

In tests, declare a factory for stubs based on global repositories:

```ts
// Registry of repositories used in the application
const registry = {
  orderRepository,
  userRepository,
  productRepository,
};

// Factory for creating stubs for each repository
declare function createMockRepositories(): typeof registry;
```

:::tip
The repository registry can be declared at the real code level, in which case it does not need to be created in tests,
reducing coupling.
:::

Next, declare a component that will inject the described dependencies:

```tsx
type Props = React.PropsWithChildren<{ repositories: typeof registry }>;

const RepositoryReplacer: React.FC<Props> = ({ repositories, children }) => {
  useMemo(() => {
    /**
     * *Optionally* mark non-mocked methods as not implemented by default.
     * This simplifies debugging and prevents unwanted side effects.
     */
    markAllAsNotImplemented();

    injectImplementations(repositories);
  }, []);

  return children;
};

function markAllAsNotImplemented() {
  forEveryMethod(registry).forEach(
    (repository, method) => (registry[repository][method] = notImplemented),
  );
}

function injectImplementations(overrides: Props['repositories']) {
  forEveryMethod(overrides).forEach(
    (repository, method, impl) => (registry[repository][method] = impl),
  );
}
```

Integration with `storyshots`:

```ts title="preview.ts"
export const { run, it } = createPreviewApp({
  createExternals: createMockExternals,
  createJournalExternals: createJournalExternals,
});
```

```tsx title="run.tsx"
run(
  map(stories, (story) => ({
    render: (repositories) => (
      // In the storyshots environment, test dependencies are injected
      <RepositoryReplacer repositories={repositories}>
        <App />
      </RepositoryReplacer>
    ),
    ...story,
  })),
);
```

:::warning Attention
Dependencies are not replaced immediately, but at the time of `render` function execution in `RepositoryReplacer`. This means that if
the dependencies are used before this point—for example, during module loading—their implementation remains original:

```ts title="index.ts"
// getVersion will not be mocked because it runs before RepositoryReplacer replacement.
const version = manifestRepository.getVersion();

export const App = () => {
  /* ... */
};
```

Dependencies can be replaced earlier, but then the `arrange` function will not work for them.
:::

### Evaluation {#evaluation}

Advantages:

- **Conciseness** – the method does not require creating many additional entities.
- **Independence** – due to its implicit nature, this method is ideal for use in legacy systems.
- **Global scope** – with this kind of mocking, behavior can be replaced even in places not originally designed for it—
  for example, in third-party libraries.

Disadvantages:

- **Lack of strictness** – there is no guarantee that all dependencies used in the application are replaced.
- **Lack of safety** – the correctness of side effects cannot be fully verified using static types.

:::tip
Mocking through inversion and side effects can be combined:

- Repositories can be mocked using inversion, as they are part of the application and fully under developer control.
- Web-API should be mocked via side effects, as it is global and publicly accessible. The library [`@storyshots/web-api-mocks`](/modules/web-api)
  performs exactly this.
:::
