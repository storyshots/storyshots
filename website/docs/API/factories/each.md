---
sidebar_position: 3
---

# each {#each}

Part of the test factories family. Generates stories based on the provided list of values.

```ts
export const statusStories = each(['Online', 'Offline', 'Busy'], (status) =>
  it(`shows user status as ${status}`),
);
