---
name: effective-types
description: Use this skill when working with TypeScript.
---

# Effective Types

Guidance on how to use types efficiently.

## Strict TypeScript Only

- No implicit `any`.
- Avoid type assertions. If one is unavoidable, add a short comment explaining why it is necessary.

## Make Data Flow Explicit

- Encode behavior in function signatures.
- Prefer input/output types that communicate all outcomes.

```ts
import { Either, Failure } from '@reksoft/utils';

type NaNFailure = Failure<'NaNFailure', void>;

const parseNumber = (
  input: string
): Either<NaNFailure, number> =>
  Number.isNaN(Number(input))
    ? Either.left({ kind: 'ParseNumberFailure', body: undefined })
    : Either.right(Number(input));
```

## Use `Either` as a General Choice Type

`Either` is not only for errors. It can model valid alternatives.

IMPORTANT: Do not use `Either` when underlying types do not intersect:

```typescript
function a(): string | boolean /* do not use Either here since string & boolean = never */ {}
```

## Keep Types Precise, Not Overcomplicated

- Types should reveal behavior to readers.

## Omit Unused generics

Omit/replace generics that are unused:

```typescript
function isEvenArrayBAD<T>(list: T[]): boolean {
  return list.length % 2 === 0;
}

// T is not used so it can be safely omitted
function isEvenArrayGOOD(list: unknown[]): boolean {
  return list.length % 2 === 0;
}
```

## Prefer Explicit Guards

Use explicit guards defined in `@reksoft/utils/guards` when possible:

```typescript
// Instead of using JS type conversion
if (!element) {
}

// Use predefined guards
if (isNil(element)) {
}
```

## Encode Structure via Brands

Use Brands for values that have implicit invariants:

```typescript
/**
 * UserID is not just usual number.
 * 
 * * It is unique
 * * A user can be found by it
 * * etc.
 */
const UserID = Brand<number, 'UserID'>;
```


## Other Notable Rules

- Use `readonly` only when the user explicitly requests immutable types/collections.
