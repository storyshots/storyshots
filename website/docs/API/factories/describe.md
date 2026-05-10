---
sidebar_position: 2
---

# describe {#describe}

Part of the test factories family. Wraps stories into a semantic group.

```ts
export const loginStories = describe('Login', [
  it('renders login form' /* ... */),
  it('displays error on invalid credentials' /* ... */),
  describe('Authentication Flow', [
    it('successfully logs in with valid credentials' /* ... */),
    it('displays loading spinner during authentication' /* ... */),
  ]),
]);
```
