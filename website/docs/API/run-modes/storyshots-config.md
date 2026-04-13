---
sidebar_position: 3
---

# StoryshotsConfig {#storyshotsconfig}

Configuration for the `storyshots` runner. Used when running in [UI](/API/run-modes/runUI) and [CI](/API/run-modes/runCI) modes.

---

# devices {#devices}

Describes the list of [devices](/API/test-components/story-config#device) on which stories are run.

:::note
The first object in the `devices` list becomes the [default device](/ui/#run).
:::

```ts
export default {
  devices: [
    {
      name: 'desktop',
      width: 1480,
      height: 920,
    },
    {
      name: 'mobile',
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
      width: 414,
      height: 896,
    },
  ],
  /* ... */
};
```

## createServer {#createserver}

Accepts an [app server](/specification/arch#appserverfactory).

`createServer` receives `AppArgs` where:

- `devices` is the current list of configured devices
- `mode` is either `exploration` or `emulation`

```ts
import { createAppServer } from '../manager/createAppServer';

export default {
  createServer: createAppServer(),
  /* ... */
};
```

## paths {#paths}

Contains the paths for `storyshots` artifacts.

```ts
export default {
  paths: {
    // Path to the folder with journal files
    journal: path.join(process.cwd(), 'journal'),
    // Path to the folder with screenshots
    screenshots: path.join(process.cwd(), 'screenshots')
  },
  /* ... */
};
```

## agentsCount {#agentscount}

Defines playwright agents count:

```ts
export default {
  agentsCount: 4,
  /* ... */
};
```

:::note
There is no strict formula determining the recommended number of agents. The optimal value should be determined experimentally.
:::
