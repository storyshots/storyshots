---
name: unit-test-writer
description: Write or update unit tests. Use when user asks to write tests or extend test coverage for existing code.
---

# Unit Test Writer

- Write tests with `describe`/`it` pattern.
- Name test files as `<entity_under_test>.spec.ts`. Here is small example:

File tests `ID` object and named as `id.spec.ts`:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ID } from './index.js';

describe('ID defines utilities for url/filename safe identifiers', () => {
  it('createStoryID creates kebab case for basic phrase', () => {
    assert.strictEqual(
      ID.createStoryID('Basic Story Name'),
      'basic-story-name'
    );
  });
});
```

- Place test files inside <project>/specs:

```text
project/
├── specs/
├── └── id.spec.ts <-- Tests are placed here
├── src/
└── └── id.ts
```

- Prefer strict comparison to property testing by default.
- Use snapshots for compound values.

When value to compare with is complex enough (e.g. compound objects), use snapshots:

```typescript
import { describe, it } from 'node:test';
import { createStoryFactories } from './index.js';

describe('createStoryFactories creates parent-aware story trees', () => {
  it('snapshots a single it node', (t) => {
    const tree = createStoryFactories().it('single story', {});

    t.assert.snapshot(tree); // <- Large compound object is verified automatically by a snapshot
  });
});
```