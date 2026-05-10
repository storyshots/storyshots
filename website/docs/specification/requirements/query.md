---
sidebar_position: 3
---

import { BalancedMetricsTip, Metric } from '@site/src/MetricsTip';

# Queries {#queries}

<BalancedMetricsTip improves={[Metric.Maintainability, Metric.Speed]} />

Queries include *implicit* inputs into the program.
Relates to the [*arguments*](/specification/requirements/borders#define-boundaries) section.

Consider a simple example — the `Date` class method used to get the current date.

```ts
+new Date(); // 1741963243818

await wait(5_000);

// The function returning the current date returns different results depending on the execution time
+new Date(); // 1741963320257
```

Note that the current date function returned different results, even though the arguments passed to it did not change.

This is a key property of nondeterministic functions.

## Determinism {#determinism}

Deterministic functions are those whose result is fully determined by their input arguments:

```ts
// The double function is deterministic
const double = (n: number) => n * 2;

// If called again with the same argument
double(5); // 10

// The result will be the same
double(5); // 10
```

The source of nondeterministic behavior is hidden mutable environment — data affecting the function's result but not explicitly passed to it.

In the following, for simplicity, we will refer to it as **state**.

```ts
let counter = 0; // The external counter variable forms the state of incr
function incr() {
  counter += 1;
  
  return counter;
}

// incr is nondeterministic
incr(); // 1
incr(); // 2
incr(); // 3
```

To make the `incr` function deterministic, we must eliminate the state:

```ts
function incr(initial = 0) {
  //          ^^^^^^^ the initial argument is not hidden state
  return {
    value: initial + 1,
    next: () => incr(initial + 1),
  };
}

// incr is now a deterministic function
const iter_0 = incr();

iter_0.value // 1

// iter_0.next is also deterministic and returns the same result
const iter_1 = iter_0.next();

iter_1.value // 2
```

:::warning
This example illustrates the principle of modeling state, not a recommended implementation style.
:::

## Mutable Environment {#mutable-environment}

The presence of hidden mutable environment in the AUT makes its behavior unpredictable and unsuitable for baseline testing.

Therefore, it is necessary to:

* Eliminate external state by placing access interfaces in the [arguments](/specification/requirements/borders#define-boundaries) layer.
* The substitute interface should be as *thin* and *simple* as possible to maintain regression protection.

```ts
function formatDate(date: Date) {
  //                ^^^^ dependency becomes inverted
  // ... //
}

function test() {
  // Now, the function's behavior is easily controllable
  snapshot(formatDate(new Date(2026, 1, 1, 12, 0, 0, 0, 0)));
}
```

<details>
  <summary>Substitution Principle</summary>
  <p>
    By isolating and replacing queries, the test environment should provide deterministic alternatives that are
    *compatible* with the expected program interface:
    
    ```ts
    declare function formatDate(date: Date);
    
    // Test is valid, as a compatible interface is passed
    snapshot(formatDate(new Date(2026, 1, 1, 12, 0, 0, 0, 0)));
    
    // Test is invalid, types are incompatible
    snapshot(formatDate(dayjs()));
    ```
    
    In other words, the substituted value must be a **valid subtype** of the expected one.
    
    Otherwise, the test will verify behavior that is *impossible in the real runtime environment*.
  </p>
</details>

Next, we will examine specific categories of functions dependent on implicit mutable environment.

## Server Queries {#server-queries}

Network queries to the server are the simplest category of nondeterministic functions:

```ts
// The result of getUserById directly depends on the current database state
getUserById(1); // { name: 'Vasiliy' }

// After some time...

getUserById(1); // 404
```

:::note
Only network queries that do not modify observable data in the database are considered part of the "queries" component (see [commands](/specification/requirements/command)).
:::

## Environment Events {#environment-events}

Some environment events can also be classified under this category:

```ts

/**
 * Listens for the event when the computer wakes up.
 * Passes the total sleep duration to the handler.
 */
declare function onComputerWakeUp(handle: (sleptForMS: number) => void);
```

Functionality depending on `onComputerWakeUp` will be difficult to test: not only is it nondeterministic, but it also depends on a hard-to-reproduce environment (putting the computer to sleep).

Consider the following example:

```ts
// Show a notification
const notification = showMessage('Message read');

// Close after 5 seconds
setTimeout(() => notification.close(), 5_000);
```

Within the AUT, `setTimeout` and the current specification can be considered deterministic; however, leaving it as-is will increase test execution time, significantly harming [performance](/specification/metrics#performance).

## Animations {#animations}

Let’s start by implementing a timer function:

```ts
async function* onEachSecond(): AsyncGenerator<Date> {
  while (true) {
    await wait(1_000);
    
    yield new Date();
  }
}
```

:::note
The `onEachSecond` function returns not a single `Date` object, but an entire *asynchronous sequence*.
:::

Based on `onEachSecond`, implement an animation:

```ts
/**
 * Animations, whether JS or CSS, are always based on a time counter.
 */
const startedAt = new Date();

// onEachSecond() can control the animation speed and direction
for await (const now of onEachSecond()) {
  const duration = sub(now, startedAt);

  setPointPositionBy(point, duration);
}
```

Thus, animations are inherently nondeterministic in nature.

:::note
Within AUT testing, the focus is not on the infinite animation process, but on its *discrete observable states*.
:::

:::warning Attention
Leaving `setTimeout`, `setInterval`, animations, and similar elements unchanged will not only increase test execution time but also complicate test writing.
:::

## Library Integration {#library-integration}

`storyshots` implements the following approaches for replacing nondeterministic behavior:

* Animations, blinking cursors, and transitions are replaced by the library **automatically**.
* For JS animations, use the [previewing](/modules/react#previewing) flag.
* Web API components such as `setTimeout`, `Date`, and others can be replaced using [invasive](/patterns/replace#mocking-through-inversion) and [non-invasive](/patterns/replace#mocking-through-side-effects) methods.
* The "queries" component is stored in the `externals` object and replaced using [arrange](/modules/react#arrange)
