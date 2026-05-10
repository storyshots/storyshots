---
sidebar_position: 2
---

# Quick Start {#quick-start}

`storyshots` integrates easily into existing applications thanks to its [architecture](/specification/arch).

## Installation and Build {#installation-and-build}

:::note
At the moment, the library is not published to any package registries due to an unstable package structure.
Components are installed from local artifacts, not from a public registry.
:::

Install dependencies in the root of the [project](https://github.com/storyshots/storyshots):

```shell
npm install
```

Build packages and package them into an archive:

```shell
npm run build && npm run pack
```

## Integration into Project {#integration-into-project}

As a result, `.tar` artifacts will be generated. Descriptions of these components can be found in the [architecture](/specification/arch) and [modules](/modules/) sections.

:::tip
For a standard [CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR) project using `react`, the following set will be sufficient:

- `@storyshots/core` – the core of `storyshots`.
- `@storyshots/react` – the client preview for `react` applications.
- `@storyshots/exec-preview` – the preview server.
:::

These modules must be placed in the project folder and added to VCS control:

```plaintext
project/
├── src/
├── offline/
│   ├── @storyshots-core-0.0.18.tgz
│   ├── @storyshots-react-0.0.18.tgz
│   └── @storyshots-exec-preview-0.0.18.tgz
└── package.json
```

Next, register the dependencies:

```json title="package.json"
{
  "devDependencies": {
    "@storyshots/core": "file:offline/storyshots-core-0.0.18.tgz",
    "@storyshots/react": "file:offline/storyshots-react-0.0.18.tgz",
    "@storyshots/exec-preview": "file:offline/storyshots-exec-preview-0.0.18.tgz"
  }
}
```

And install them:

```shell
npm i
```

## Preview Description {#preview-description}

:::note
Files related to `storyshots` in this guide are located in `src/storyshots` (see [test location](/patterns/files#test-location)).
:::

After installation, you're ready to define the [preview client](/specification/arch#ipreviewclient) and your first stories. Let's start with the preview:

```ts title="/src/storyshots/preview/config.ts"
import { createPreviewApp } from '@storyshots/react';

// Initialize the preview
export const { it, run } = createPreviewApp({
  /*
   Define default behavior for external dependencies.
   In this case, it's BE API methods.
  */
  createExternals: (config) => ({
    getUser: async () => ({ id: 1, name: 'John Doe' }),
  }),
  // Mark methods for logging calls
  createJournalExternals: (externals, config) => ({
    getUser: config.journal.asRecordable('getUser', externals.getUser),
  }),
});
```

Then, define your first stories:

```tsx title="/src/storyshots/stories/index.tsx"
import { finder } from '@storyshots/core';

import { it } from '../preview/config';

export const stories = [
  it('renders the application correctly'),
  it('handles missing user gracefully', {
    // Modify server behavior for this story
    arrange: (externals) => ({ ...externals, getUser: async () => null }),
  }),
  it('allows to login', {
    // Simulate actions on the page
    act: (actor) => actor.click(finder.getByRole('button', { name: 'Login' })),
  }),
];
```

:::tip
Stories can be [decomposed](/patterns/stories#story-splitting).
:::

Then, run the defined stories by implementing the [default render](/patterns/stories#universal-render) with [dependency injection](/patterns/replace#mocking-through-inversion):

```tsx title="/src/storyshots/preview/index.tsx"
import { map } from '@storyshots/core';

import { run } from './config';
import { stories } from '../stories';

run(
  map(stories, (story) => ({
    render: (externals) => (
      <Externals externals={externals}>
        <App />
      </Externals>
    ),
    ...story,
  })),
);
```

## Manager Description {#manager-description}

Next, define the [app server](/specification/arch#appserverfactory):

```ts title="/src/storyshots/manager/createAppServer.ts"
import { createExecPreview } from '@storyshots/exec-preview';

export function createAppServer() {
  return createExecPreview({
    ui: {
      command: 'npx webpack-cli serve', // <- Script to run the app in dev mode
      at: 'http://localhost:8080', // <- Dev server address
    },
    ci: {
      command: 'npx webpack-cli build', // <- Build script
      serve: './dist', // <- Location of the build artifact
    },
  });
}
```

Also, configure the used bundler (in this example, `webpack`), specifying the correct `entry`:

```ts title="webpack.config.ts"
export default {
  entry:
    // process.env.STORYSHOTS is automatically set by @storyshots/exec-preview
    process.env.STORYSHOTS === 'true' // <- Set entry for preview depending on the build mode.
      ? './src/storyshots/preview/index.tsx'
      : './src/index.tsx',
  // ... ///
};
```

:::tip
More details about `@storyshots/exec-preview` can be found in [this section](/modules/exec).
:::

After defining the server, define the general testing configuration:

```ts title="/src/storyshots/manager/config.ts"
import { ManagerConfig } from '@storyshots/core/manager';

import { createAppServer } from './createAppServer';

export default {
  // List of tested devices
  devices: [
    {
      name: 'desktop',
      width: 1480,
      height: 920,
    },
  ],
  // Paths to main artifacts: screenshots and records
  paths: {
    screenshots: path.join(process.cwd(), 'screenshots'),
    records: path.join(process.cwd(), 'records'),
  },
  // App server configuration
  preview: createAppServer(),
} satisfies ManagerConfig;
```

:::tip
A full list of available settings is available in [this section](/API/run-modes/manager-config).
:::

Then, start the UI mode using:

```shell
storyshots --ui /src/storyshots/manager/config.ts
```

:::note
To run all tests in headless mode, use:

```shell
storyshots /src/storyshots/manager/config.ts
```
:::

## Examples {#examples}

- [**Example #1**](https://github.com/storyshots/storyshots/tree/master/examples/basic-externals) вЂ“ `react` + `webpack` + standard `fetch` queries.
- [**Example #2**](https://github.com/storyshots/storyshots/tree/master/examples/msw-externals) вЂ“ `react` + `webpack` + `rtk-query`.
- [**Example #3**](https://github.com/storyshots/storyshots/tree/master/examples/next-app) вЂ“ `next.js`.

