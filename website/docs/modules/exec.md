---
sidebar_position: 7
---

# @storyshots/exec-preview

[App server](/specification/arch#appserverfactory). Starts the application server using the project's original scripts.

:::tip
`@storyshots/exec-preview` is the recommended app server for most applications.
:::

## createExecPreview {#createexecpreview}

Creates an app server based on the provided development modes:

```ts
import { ManagerConfig } from '@storyshots/core/manager';
import { createExecPreview } from '@storyshots/exec-preview';

export default {
  preview: createExecPreview({
    ui: {
      command: 'npx webpack-cli serve', // <- Script to start the app in dev mode
      at: 'http://localhost:8080', // <- Dev server address
    },
    ci: {
      command: 'npx webpack-cli build', // <- Build artifact script
      serve: './dist', // <- Location of the built artifact
    },
  }),
  /* ... */
} satisfies ManagerConfig;
```

`createExecPreview` runs the commands by setting `process.env.STORYSHOTS` to `true`:

```ts title="webpack.config.ts"
export default {
  entry:
    process.env.STORYSHOTS === 'true'
      ? './src/storyshots/preview/index.tsx' // <- For storyshots, change the project entry
      : './src/index.tsx',
  // ... ///
};
```
