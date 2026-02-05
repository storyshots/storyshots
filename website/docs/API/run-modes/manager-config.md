---
sidebar_position: 3
---

# ManagerConfig {#managerconfig}

Configuration for the `storyshots` manager. Used when running in [UI](/API/run-modes/runUI) and [CI](/API/run-modes/runCI) modes.

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

## preview {#preview}

Accepts an [app server](/specification/arch#appserverfactory).

```ts
import { createAppServer } from '../manager/createAppServer';

export default {
  preview: createAppServer(),
  /* ... */
};
```

## paths {#paths}

Contains the paths for `storyshots` artifacts.

```ts
export default {
  paths: {
    // Path to the folder with logs
    records: path.join(process.cwd(), 'records'),
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

## compare {#compare}

Describes the algorithm for comparing two images.

:::note
By default, `storyshots` uses an algorithm that accounts for human color perception, making tests less fragile.
:::

### withPlaywright {#withplaywright}

Delegates screenshot comparison to `playwright`:

```ts
export default {
  compare: Compare.withPlaywright(options),
  /* ... */
};
```

---

### comparator {#comparator}

Pixel comparison algorithm:

- ssim-cie94 - https://en.wikipedia.org/wiki/Structural_similarity_index_measure
- pixelmatch - uses https://www.npmjs.com/package/pixelmatch

#### threshold {#threshold}

Comparison tolerance (from 0 to 1, where 0 is maximum strictness). Works only for pixelmatch

#### maxDiffPixels {#maxdiffpixels}

Maximum allowed difference in pixels. 0 by default

##### maxDiffPixelRatio {#maxdiffpixelratio}

Maximum allowed difference in pixels (ratio: from 0 to 1). 0 by default

### withLooksSame {#withlookssame}

Uses [looks-same](https://github.com/gemini-testing/looks-same).

```ts
export default {
  compare: Compare.withLooksSame(options),
  /* ... */
};
```

:::note
All main [options](https://github.com/gemini-testing/looks-same?tab=readme-ov-file#comparing-images) are available
except `createDiffImage` (diff is always created as it is mandatory for `storyshots`)
:::

### Optimal Algorithm {#optimal-algorithm}

Although the library provides a minimal required set of algorithms out of the box, it may not be suitable for specific project needs.

:::tip
The right algorithm is one that minimizes false positives (fragile tests) while still catching defects (ensuring high regression protection).
:::

That’s why `storyshots` allows you to implement your own solution:

```typescript
{
  compare: (actual, expected, story) => Promise<ComparisonResult>;
  /* ... */
}
```

- _actual_ – screenshot of current behavior
- _expected_ – baseline screenshot
- _story_ – story object including [meta attributes](/API/factories/it#storyattributes)

The result of the algorithm is a `ComparisonResult` object containing:

- _equal_ – flag indicating whether the two screenshots are equal
- _explanation_ – if screenshots are not equal, contains additional information
- _diff_ – reference to the final diff image

:::tip
The comparison interface is asynchronous, opening up additional possibilities for advanced comparison techniques, such as using online services.
:::
