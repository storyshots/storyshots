---
sidebar_position: 2
---

# StoryConfig {#storyconfig}

Settings for the current story.

---

## device {#device}

The device on which the test is running.

Example of a `desktop` device:

```ts
const desktop: Device = {
  name: 'desktop',
  width: 1480,
  height: 920,
};
```

Example of a `mobile` device:

```ts
const mobile: Device = {
  name: 'mobile',
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
  width: 414,
  height: 896,
};
```

:::tip
The list of available devices can be found [here](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json).
:::

## journal {#journal}

Represents an instance of a [journal](/specification/requirements/command#verification-method).

### record {#record}

Records a method call, preserving its name and arguments.

```ts
it('...', {
  arrange: (externals, config) => ({
    createUser: (body) => {
      config.journal.record('createUser', body);

      return externals.createUser(body);
    },
  }),
});
```

:::note
Implementation depends on the [preview client](/specification/arch#ipreviewclient). For example, in [`@storyshots/next`](/modules/next), the method is **asynchronous**.
:::

### asRecordable {#asrecordable}

Wraps a function to log its calls.

```ts
it('...', {
  arrange: (externals, config) => ({
    createUser: config.journal.asRecordable('createUser', externals.createUser),
  }),
});
```
