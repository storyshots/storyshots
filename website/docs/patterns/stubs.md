---
sidebar_position: 5
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Writing Stubs {#writing-stubs}

`storyshots` minimizes the effort required to write test scenarios thanks to its architecture; however, there remains one area that demands significant attention from developers — stubs.

:::note
Stubs take up the largest total code volume in tests written using `storyshots`.
:::

## Factory Stubs {#factory-stubs}

<MetricsTip improves={[Metric.Maintainability, Metric.Speed]} />

Stubs can be described in two main ways:

- As a static object:

```ts
const userStub = {
  name: 'Vasiliy',
  position: {
    role: {
      isAdmin: true,
    },
  },
};
```

- Or as a factory:

```ts
function createUserStub(): User {
  return {
    name: 'Vasiliy',
    position: {
      role: {
        isAdmin: true,
      },
    },
  };
}
```

In most cases, factories are recommended. This is due to the following reasons:

### Less Initialization Time {#less-time-for-initialization}

Static stubs are created immediately at application startup, negatively affecting test initialization time.

:::note
All stubs will be created without exception, even if they are not used in the running test.
:::

Factories avoid this issue because they represent _lazy_ data, created only when needed in a story.

### Simplifying Changes {#simplifying-changes}

Static objects, and especially constants, are dangerous to mutate directly, as they may affect the behavior of other clients:

```ts
it('...', {
  arrange: (user) => ({
    asNonAdmin: async () => {
      /**
       * Mutating the object directly is dangerous, as it may be used elsewhere.
       */
      userStub.position.role.isAdmin = false;

      return userStub;
    },
    /**
     * Another function references the same object and will be affected by `asNonAdmin` behavior,
     * which may be undesirable.
     */
    getAdmin: () => userStub,
  }),
});
```

To avoid unintended side effects, the object must be cloned directly:

```ts
it('displays living address', {
  arrange: (user) => ({
    // Now the effect is isolated within the `asFired` function
    asNonAdmin: async () => ({
      ...userStub,
      authorities: {
        ...userStub.position,
        role: {
          ...userStub.position.role,
          isAdmin: false,
        },
      },
    }),
    getAdmin: () => userStub,
  }),
});
```

This burdens the syntax and complicates test readability. With factories, it's simpler:

```ts
it('displays living address', {
  arrange: (user) => ({
    asFired: async () => {
      const user = createUserStub();
      /**
       * The object can be safely modified directly, as we are working with a unique copy.
       */
      user.position.role.isAdmin = false;

      return user;
    },
    /**
     * Another function references its own instance of user.
     */
    getAdmin: () => createUserStub(),
  }),
});
```

:::note
This property of factories (their _purity_) makes them simple to extend and reuse. Therefore, in this documentation, most examples demonstrate the use of this approach.
:::

:::tip
Using static variables and direct mutation is allowed (and even encouraged) for modeling [compatible behaviors](/patterns/externals#emulation-externals).
:::

## Modular Stubs {#modular-stubs}

<MetricsTip improves={[Metric.Maintainability, Metric.Speed]} degrades={[Metric.RefactoringAllowance]} />

One way to simplify stubs is to use a modular structure similar to [modular external environments](/patterns/externals#modular-externals). If in repositories the extensible unit was a method, then for stubs it is their properties:

<p style={{ color: 'red' }}>Instead of this:</p>

```ts
function createUserStub(): User {
  return {
    name: 'Vasiliy',
    position: 'developer',
    living: {
      city: 'Moscow',
    },
    /* And 20+ more properties */
  };
}
```

<p style={{ color: 'green' }}>Do this:</p>

```ts
/**
 * Define a minimal set of fields for all stories or leave empty
 */
function createMinimalUserStub(): User {
  return {
    name: 'Vasiliy',
    position: 'developer',
  } as User;
}

it('displays living address', {
  arrange: (user) => ({
    getUser: async () => ({
      ...createMinimalUserStub(),
      living: { city: 'Moscow' }, // The story sets only the fields it needs
    }),
  }),
});
```

Modularity allows stories to define only the data they need in stubs, but this is just one tool for reducing their volume.

:::note
Stubs also inherit the responsibility-related issues described in detail in the [modular external environment](/patterns/externals#modular-externals) section.
:::

:::warning Important
Use caution with solutions for generating stubs similar to [faker-js](https://github.com/faker-js/faker). They often produce [non-deterministic](/specification/requirements/query#determinism) data.
:::

## Non-Redundant Stubs {#non-redundant-stubs}

<MetricsTip improves={[Metric.Maintainability, Metric.Speed]} />

Only define methods that are actually used by the application.

:::note
This point is closely related to [modular stubs](/patterns/stubs#modular-stubs). However, while the latter describes a specific method of separation and composition, this section addresses a more abstract representation of the problem.
:::

A common cause of large stubs is not the behavior itself, but the types defined in the source code:

```ts
// All fields in the model are required and there are many of them
type User = {
  name: string;
  position: string;
  living: {
    city: string;
  };
  /* And 20+ more properties */
};
```

:::note
The compiler requires developers to declare all required fields defined in the model, even when writing a stub for a test.
:::

The problem lies in the fact that these types are often copied from external systems, such as `swagger`, and ultimately do not reflect the actual state: the application may use only 5 out of 20 fields, while stubs declare all properties without exception.

<p style={{ color: 'red' }}>Instead of this:</p>

```ts
type User = {
  name: string;
  position: string;
  living: {
    city: string;
  };
};
```

<p style={{ color: 'green' }}>Do this:</p>

```ts
/**
 * Make the model more precise and eliminate unused fields
 */
type User = {
  name: string;
  position?: string;
};
```

:::warning Important
On projects, various API interface generators are often used. This is a convenient tool, but the final accuracy of models may be [insufficient](https://en.wikipedia.org/wiki/Algebraic_data_type).
:::

## Relevant Stubs {#relevant-stubs}

<MetricsTip improves={[Metric.RegressionProtection, Metric.Maintainability]} />

Test data (or, in other words, stubs) are a critical element of a test scenario. It is important that the content of stubs aligns with domain requirements and conditions dictated by the model:

<p style={{ color: 'red' }}>Instead of this:</p>

```ts
function createUserStub(): User {
  return {
    name: 'UserName',
    roles: [],
  };
}
```

<p style={{ color: 'green' }}>Do this:</p>

```ts
function createUserStub(): User {
  return {
    name: 'Васильев Василий Васильевич', // User name contains full name
    roles: ['admin'], // Roles cannot be empty according to the model
  };
}
```

Relevant stubs, aligned with domain and model, bring the following benefits to tests:

- Regression protection — stubs have exactly the same properties as real server data. This increases testing effectiveness, as the system is verified in an environment identical to the real one.
- Documentation — by using more representative data, stories and baseline snapshots resemble the real application more closely and can serve as an additional source of documentation.

:::note
Defining irrelevant stubs is like forcing our application to communicate with a "broken" server, which obviously negatively impacts story stability and increases their fragility.
:::

## Sufficient Stubs {#sufficient-stubs}

<MetricsTip improves={[Metric.Speed, Metric.Maintainability]} />

Data should be as diverse as required to cover the main and all alternative application scenarios. On the other hand, they must remain non-redundant — maintained only when nothing can be removed without losing their sufficiency.

<p style={{ color: 'red' }}>Instead of this:</p>

```ts
function createUserStub(): User {
  return {
    name: 'Vasiliy',
    address: 'Moscow',
  };
}
```

<p style={{ color: 'green' }}>Do this:</p>

```ts
function createUserStub(): User {
  return {
    name: 'Vasiliy',
    /**
     * The address field is removed as it is not used in the application
     * and thus not required to cover all its scenarios.
     */
  };
}
```

:::tip
This pattern is closely related to [modular stubs](/patterns/stubs#modular-stubs).
:::

## Simplified Stubs {#simplified-stubs}

<MetricsTip improves={[Metric.Maintainability]} />

Test data contain many complex fields, such as identifiers, references to other entities, and dates. Simple values should be used for such properties whenever possible.

:::tip
This reduces the complexity of the stubs themselves without affecting test coverage.
:::

<p style={{ color: 'red' }}>Instead of this:</p>

```ts
function createUserStub(): User {
  return {
    id: 5142,
    name: 'Vasiliy',
    updatedAt: '2024-06-28T15:00:00.000Z',
  };
}
```

<p style={{ color: 'green' }}>Do this:</p>

```ts
function createUserStub(): User {
  return {
    id: 1,
    name: 'Vasiliy',
    updatedAt: createConstDate().toJSON(),
  };
}

/**
 * Set any fixed date relevant to all stories. It can be adjusted as needed in specific factories.
 */
declare function createConstDate(): Date;
```
