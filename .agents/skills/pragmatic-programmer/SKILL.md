---
name: pragmatic-programmer
description: Use this skill when working with code (develop or refactor).
---

# Pragmatic Programmer

Guidance on how to use write effective, yet simple functions.

## Conditions

### Positive Conditions

Prefer positive conditions to negative:

DO NOT:
```typescript
if (!condition) {
  {branch_0}
} else {
  {branch_1}
}
```

DO:
```typescript
if (condition) {
  {branch_1}
} else {
  {branch_0}
}
```

### Flat Branches

Insert shorter expressions inside branches, while keeping longer one outside:

DO NOT:
```typescript
if (condition) {
  {very_long_branch}
}

return {short_branch};
```

DO:
```typescript
if (!condition) {
  return {short_branch};
}

{very_long_branch}
```

Prefer a short early-return guard (positive or negative) and keep the main/longer flow after that guard.
Do not place the longest logic block inside a branch when it can be moved outside with an early return.

## Entities Order

Entities (e.g. types, functions, constants) MUST be ordered as follows:

1. All public declarations first (no private declaration may appear above any public one)
2. Inside public declarations: public types, then public constants, then public functions
3. After all public declarations, place private/internal declarations
4. Inside private declarations: private types, then private constants, then private functions

Any two same-access entities must be ordered mutually in such a way, so that consumer is placed ABOVE provider:

```typescript
// Function a calls function b, so it is placed above
function a() {
  b();
}

// b is placed bellow a because it is used by a
function b() {}
```

## Variable Usage

- Prefer inlining single-use values when readability is not harmed.
- Introduce temp variables only when values are reused or naming improves clarity.
- Avoid eager declarations for values that may not be used; compute them lazily in the branch/path where they are needed.

## Namings

In general, prefer readable names that do not duplicate what is known from the context:

```typescript
// Bad, we might quickly forget what is inside
const a = getUsers();

// Better, but name duplicates a container type
const usersList = getUsers();

// Great
const users = getUsers();
```
