---
sidebar_position: 6
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# External Environment {#external-environment}

[*Queries*](/specification/requirements/query) are one of the key components of `storyshots`, and working with them can be tricky, requiring special attention to maintain testing quality.

## Ignoring query {#ignoring-query}

<MetricsTip improves={[Metric.RefactoringAllowance, Metric.Maintainability]} degrades={[Metric.RegressionProtection]} />

`storyshots` provides methods for tracking function calls, specifically the [journal](/specification/requirements/command#verification-method). You can record any method, and this often leads to confusion. Consider the following example:

```ts
const createMockUserRepository = (): UserRepository => {
  return {
    getUser: async () => createUserStub(),
  };
};
```

`UserRepository` contains the `getUser` method, which performs no side effects on the database but is nondeterministic. Since `getUser` belongs to the [*queries*](/specification/requirements/query) component, this function [should not be verified](/specification/requirements/borders).

<p style={{ color: 'red' }}>Instead of this:</p>

```ts
it('shows user', {
  arrange: (externals, { journal }) => ({
    ...externals,
    getUser: journal.asRecordable('getUser', externals.getUser),
  }),
});
```

<p style={{ color: 'green' }}>Do this:</p>

```ts
// Do not mark the getUser method
it('shows user');
```

Tracking `getUser` is meaningless because the method does not perform side effects.

:::tip
[Side effects](/specification/requirements/command#side-effects) are not just results that go beyond the function’s scope; within the specification, they also include _visible_ data to external clients:

- For the server: commands modifying the database
- For the user: functions rendering UI on the screen

These external effects are captured in the baseline by `storyshots`.
:::

Interaction with `getUser` is verified transitively, through the component’s rendering, which uses data from the method:

```tsx
const User: React.FC = () => {
  const response = useQuery(userRepository.getUser);

  if (response.loading) {
    return <Preloader />;
  }

  return <UserInfo user={response.data} />;
};
```

:::warning Important
This rule has one critical exception — queries like `getUser`, although they do not perform side effects, may implement non-trivial logic based on the _arguments_ passed to the method.

It is recommended to record interactions with such queries in the journal.
:::

## Unstable Views {#unstable-views}

<MetricsTip improves={[Metric.RegressionProtection]} degrades={[Metric.Maintainability, Metric.Speed]} />

Unfortunately, it is not always possible to fully control the [*queries*](/specification/requirements/query) in an application. As a result, there is a risk of obtaining an unstable baseline.

:::tip
An example is a third-party library component — a notification — whose final position upon appearing is not always the same, thus affecting screenshot stability.
:::

To address this issue, use the `retries` function:

```ts
it('shows read notification', {
  // The test will have three attempts to pass successfully
  retries: (config) => 3,
});
```

:::warning Attention
This method is not recommended in general. It is better to either [replace](/patterns/replace) the problematic function or the entire library, or exclude the test scenario altogether.
:::

## Timers {#timers}

<MetricsTip improves={[Metric.Maintainability, Metric.Speed]} />

UI interfaces are full of asynchronous interactions, some of which involve timers.

Consider the following example:

```ts
// Show a notification
const notification = showMessage('Message read');

// Close after 5 seconds
setTimeout(() => notification.close(), 5_000);
```

The above function shows a notification to the user, waits 5 seconds, and then closes it. When testing this behavior, remember that [*queries*](/specification/requirements/query) must not be used in stories.

<p style={{ color: 'red' }}>Instead of this:</p>

```ts
it('shows message to a user', {
  act: (actor) => actor.screenshot('Message').wait(5_000).screenshot('Hidden'),
});
```

<p style={{ color: 'green' }}>Do this:</p>

```ts
it('shows message to a user', {
  act: (actor) =>
    actor
      .screenshot('Message')
      // Advance timers forward by 5 seconds
      .exec(() => window.clock.tick(5_000))
      .screenshot('Hidden'),
});
```

The `wait` function in the example waits 5 seconds before continuing test execution. This is unacceptable because test execution time is a critical metric. Therefore, in the second example, fake timers are used.

:::note
In this example, the [`@storyshots/web-api-mocks`](/modules/web-api) library is used, which performs [replacement via side effects](/patterns/replace#mocking-through-side-effects).
:::

:::warning Attention
There is an alternative using dependency inversion to mock the API, but this method is not recommended for timers.
:::