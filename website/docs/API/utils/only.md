---
sidebar_position: 3
---

# only {#only}

Makes a story available only for specific devices:

```ts
// userStories will be available for execution only on desktop devices
only(['desktop'], userStories);
```

:::note
`only` only excludes stories from execution for the selected devices.

In UI mode, stories will still be displayed.
:::
