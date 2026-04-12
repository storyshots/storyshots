---
sidebar_position: 2
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Externals {#externals}

Externals - this is a well-established term for referring to the component's managed objects: [
*queries*](/specification/requirements/query) and [*commands*](/specification/requirements/command).

## Trivial Externals {#trivial-externals}

<MetricsTip improves={[Metric.RegressionProtection, Metric.RefactoringAllowance]} />

Component elements [*queries*](/specification/requirements/query) and [*commands*](/specification/requirements/command)
are mocked in `storyshots`.

- _[*Queries*](/specification/requirements/query)_ - mocked to eliminate nondeterminism.
- _[*Commands*](/specification/requirements/command)_ - mocked to eliminate side effects.

This means that the original function code will not be tested in stories, as it will be replaced with stub methods.
Therefore, special attention should be paid to the complexity of logic within such procedures.

<p style={{ color: 'red' }}>Instead of this:</p>

```ts
const userRepository: UserRepository = {
  getUser: (id) => {
    return (
      fetch(`/api/user/${id}`)
        /* Processing #1 */
        .then(parse)
        .then((user) => {
          if (user.isAdmin) {
            /* Processing #2 */
          }

          /* Processing #3 */
        })
    );
  },
};
```

<p style={{ color: 'green' }}>Do this:</p>

```ts
const userRepository: UserRepository = {
  getUser: (id) => fetch(`/api/user/${id}`),
};
```

In the first example, `userRepository.getUser` contained nontrivial logic that would not be covered by tests due to stubbing of [*queries*](/specification/requirements/query). In the second example, the mocked method is made _minimal_,
now it contains no special logic and only delegates to the server.

:::note
The extracted logic is elevated up the stack, landing in the [testable layer](/specification/arch#aut).
:::

### Build {#build}

An important, and far from obvious, special case of this rule is the application build order.

[App server](/specification/arch#appserverfactory) must build the application in an identical way to the target configuration.

<p style={{ color: 'red' }}>Instead of this:</p>

```ts title="manager.ts"
runUI({
  createServer: createFancyPreviewServer({
    /* custom build configuration inside */
  }),
});
```

<p style={{ color: 'green' }}>Do this:</p>

```ts title="manager.ts"
import { createExecPreview } from '@storyshots/exec-preview';

runUI({
  createServer: createExecPreview({
    ui: {
      // Reuse standard dev environment commands
      command: 'npm start',
      at: 'http://localhost:8080',
    },
    // ... //
  }),
});
```

The greater the difference in build and run order between `storyshots` and the target environment, the less regression protection the tests provide.

## Modular Externals {#modular-externals}

<MetricsTip improves={[Metric.Maintainability, Metric.Speed]} degrades={[Metric.RefactoringAllowance]} />

Methods that mock [*queries*](/specification/requirements/query), including stubs themselves, must be modular.
This particularly means that each story can import only those behaviors it uses internally.

Consider a repository implemented in the project as follows:

```ts
type UserRepository = {
  getUser(): Promise<User>;

  setUser(user: User): Promise<void>;

  getRoles(): Promise<string[]>;

  /* And 20+ more methods */
};
```

To implement mocking, all `UserRepository` methods must be defined:

```ts
const createMockUserRepository = (): UserRepository => {
  return {
    getUser: async () => createUserStub(),
    setUser: async () => {},
    getRoles: async () => ['admin', 'user'],
    /* And 20+ more methods */
  };
};
```

Given the size of the repository, this task is not trivial. The problem is not only the file size but also the fact that such a large object binds multiple heterogeneous stories together, which in turn are not always linked by shared responsibilities:

```ts
const stories = [
  describe('Roles', [
    it('allows admin to access panel'), // Uses UserRepository.getRoles inside
  ]),
  describe('UserSettings', [
    it('allows user to change name'), // Uses UserRepository.setUser inside
  ]),
];
```

Two different clients of `UserRepository`, in this case `Roles` and `UserSettings`, represent two different responsibilities.
Since responsibilities differ, tests will change at different times, yet in all cases the same function `createMockUserRepository` will be edited:

- On one hand, it is responsible, meaning it is hard to modify because it has many dependent clients that must be constantly re-verified.
- On the other, it has many reasons to change, as shown earlier, each client acts as a catalyst for change.

This creates a vicious cycle where `createMockUserRepository` becomes larger and more complex over time.

To solve this, it's enough to use one of the available extension patterns, for example, composition:

```ts
/**
 * Default implementation either does not exist at all or describes an absolute minimum of methods
 */
const createMockUserRepository = (): UserRepository => {
  return {} as UserRepository;
};

/**
 * Then, functions that mix in behaviors to the repository are defined. These can be one or several methods.
 */
const withUser = (repository: UserRepository): UserRepository => ({
  ...repository,
  getUser: async () => createUserStub(),
});

/**
 * Functions can be easily parameterized.
 */
const withGivenRoles =
  (roles: string[]) =>
  (repository: UserRepository): UserRepository => ({
    ...repository,
    getRoles: async () => roles,
  });

/**
 * And are tied to a specific context
 */
const withAdminRoles = withGivenRoles(['admin']);
```

After that, each story can set only those behaviors it considers necessary.

```ts
it('allows admin to access panel', {
  arrange: withAdminRoles, // Only the roles endpoint is needed
});

it('allows user to change name', {
  // Only these endpoints are needed
  arrange: (repository) => withUser(withSetUser(repository)), // <- Use function composition for clarity
});
```

:::tip
Commands, such as the `setUser` method, may not require special modularity since they are trivial and their behavior rarely changes.
They can be implemented in default mock functions, or `Proxy` can be used for default behavior for all undefined methods.
:::

:::warning Important
This method slightly increases execution speed because it doesn’t set unnecessary behaviors, but in exchange it increases story coupling to implementation details.
:::

## Composition of Externals {#composition-externals}

<MetricsTip improves={[Metric.Maintainability]} degrades={[Metric.RegressionProtection]} />

External behavior can be extended via composition in the `arrange` function:

```ts
it('allows admin to continue', {
  arrange: (externals) => ({
    ...externals,
    // Add admin role
    getUser: async () => {
      const user = await externals.getUser();

      return { ...user, roles: [...user.roles, 'admin'] };
    },
  }),
});
```

:::tip
Composition is building new behavior based on existing ones.
An important feature is that such behavior is encapsulated in a _first-class_ element (e.g., a function).
:::

- **Advantage** of this approach is its minimalism, as only the required data is changed in the given scenario.
- **Disadvantage** is the dependency on the original behavior of the extensible element, which increases test coupling to default externals.

## Mocking Externals {#mocking-externals}

<MetricsTip degrades={[Metric.Maintainability]} />

External behavior can be extended via full replacement in the `arrange` function:

```ts
it('allows admin to continue', {
  arrange: (externals) => ({
    ...externals,
    // Add admin role
    getUser: async () => {
      return { ...createUserStub(), roles: [...user.roles, 'admin'] };
    },
  }),
});
```

:::tip
Full mocking is a completely independent implementation of the `externals` method.
In the example above, the original `externals.getUser` implementation is completely ignored.
:::

- **Advantage** is that the test does not depend on the original method behavior.
- **Disadvantage** is obvious — this method requires writing more code.

## Emulation of Externals {#emulation-externals}

<MetricsTip improves={[Metric.RegressionProtection]} degrades={[Metric.Maintainability]} />

`externals` in `storyshots` includes both mutating methods for [*commands*](/specification/requirements/command) and functions working with [*queries*](/specification/requirements/query).
Often, these components form a *pair*:

```ts
function createUserRepository(): UserRepository {
  return {
    // Query method reading a list of users from the DB
    getUsers: async () => [createVasiliyStub(), createIvanStub()],
    // Command method removing a user from the DB
    removeUserById: async () => {},
  };
}
```

:::note
The `removeUserById` method belongs to the [*queries*](/specification/requirements/query) component.
:::

In most cases, it is recommended to simply record the call to `removeUserById` in the journal, while keeping its implementation trivial:

```ts
it('removes user from a list', {
  arrange: (externals, { journal }) => ({
    ...externals,
    removeUserById: journal.asRecordable(
      'removeUserById',
      externals.removeUserById,
    ),
  }),
  // Remove user from the list by name
  act: (actor) => actor.click(finder.get(removeActionByName('Ivan'))),
});
```

:::note
Thus, the behavior is verified indirectly, through a baseline of interaction with the server in the form of a call log.
:::

However, this is not always sufficient. What if we want to ensure the list has been updated and no longer displays the removed user?
For this, emulation can be used:

```ts
it('removes user from a list', {
  arrange: (externals) => {
    // Local state. In this case, the list of users
    let users = [createVasiliyStub(), createIvanStub()];

    return {
      ...externals,
      getUsers: async () => users,
      // Remove user from the list
      removeUserById: async (id) => (users = without(users, { id })),
    };
  },
  // Remove user from the list by name
  act: (actor) => actor.click(finder.get(removeActionByName('Ivan'))),
});
```

Although emulation can increase test coverage, it should be used as rarely as possible.
This is due to the significant degradation in maintainability:

- It duplicates server behavior.
- It adds extra logic in tests, thus creating more room for potential defects.

:::tip
Emulation is beneficial when the behavior is trivial on the server but complex on the client.
:::

:::warning Important
Tests are code that is not itself **tested**.
Therefore, it is crucial to maintain their cleanliness and simplicity.
:::

## Optimization of arrange {#optimization-arrange}

On projects, the `externals` structure ([*queries*](/specification/requirements/query) and [*commands*](/specification/requirements/command)) is often nested:

```ts
type Externals = {
  repositories: {
    userRepository: UserRepository;
    /* ... */
  };
  /* ... */
};
```

This makes updating it non-trivial. To fix this, compositional factories can be used:

<p style={{ color: 'red' }}>Instead of this:</p>

```ts
it('...', {
  arrange: (externals) => ({
    // High nesting makes readability suffer
    ...externals,
    repositories: {
      ...externals.repositories,
      UserRepository: {
        ...externals.repositories.UserRepository,
        getUser: (data) =>
          externals.repositories.UserRepository.getUser(data).then((user) => ({
            ...user,
            login: 'test-user',
          })),
      },
    },
  }),
});
```

<p style={{ color: 'green' }}>Do this:</p>

```ts
import { createArrangers } from '@storyshots/arrangers';

const { transform } = createArrangers<Externals>().focus('repositories');

it('...', {
  // Code does the same, but is more readable
  arrange: transform('UserRepository.getUser', (user) => ({
    ...user,
    login: 'test-user',
  })),
});
```

:::note
To learn more, refer to [`@storyshots/arrangers`](/modules/arrangers)
:::

:::tip
This pattern works especially well in combination with [modular externals](/patterns/externals#modular-externals).
:::

:::warning Attention
Story state is **automatically isolated**, so strictly speaking, `externals` can be mutated directly:

```ts
it('...', {
  arrange: (externals) => {
    externals.repositories.UserRepository.getUser = (data) =>
      externals.repositories.UserRepository.getUser(data).then((user) => ({
        ...user,
        login: 'test-user',
      }))
  },
});
```

However, this is not recommended in general, as direct mutations negatively affect the compositional properties of the function.
:::
