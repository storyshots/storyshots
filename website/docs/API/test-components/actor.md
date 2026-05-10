---
sidebar_position: 1
---

# actor {#actor}

An actor represents a [user](/specification/requirements/user). It interacts with the application by emulating actions on the page.

---

# hover {#hover}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-hover) method

## click {#click}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-click) method

## dblclick {#dblclick}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-dblclick) method

## fill {#fill}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-fill) method

## wait {#wait}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-frame#frame-wait-for-timeout) method

:::warning Attention
This method is intended solely for debugging.
:::

## scrollTo {#scrollto}

Uses the original method
[`playwright`](https://playwright.dev/docs/api/class-locator#locator-scroll-into-view-if-needed)

## select {#select}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-select-option) method

## keyboard {#keyboard}

### press {#press}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-keyboard#keyboard-press) method

### down {#down}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-keyboard#keyboard-down) method

### up {#up}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-keyboard#keyboard-up) method

## mouse {#mouse}

### move {#move}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-mouse#mouse-move) method

### down {#down}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-mouse#mouse-down) method

### up {#up}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-mouse#mouse-up) method

### wheel {#wheel}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-mouse#mouse-wheel) method

## clear {#clear}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-clear) method

## highlight {#highlight}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-highlight) method

:::warning Attention
This method is intended solely for debugging.
:::

## drag {#drag}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-drag-to) method

## blur {#blur}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-blur) method

## pressSequentially {#presssequentially}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-press-sequentially) method

## waitFor {#waitfor}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-wait-for) method

## waitForURL {#waitforurl}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-page#page-wait-for-url) method

## resize {#resize}

Changes the browser viewport according to the configuration:

```ts
actor.resize({ width: 1440, height: 920 });
```

:::tip
`resize` also affects the screenshot size. It is recommended to use this method when capturing long forms and lists.
:::

:::note
The size is preserved for all subsequent actions and can be overridden by a subsequent `resize`.
:::

## screenshot {#screenshot}

Takes intermediate screenshots during page interactions.

:::note
If called last in the chain, it overrides the parameters of the last screenshot created by default.
:::

:::warning Attention
Screenshot names must be in PascalCase format. Underscores are allowed as well.
:::

```ts
actor
  // Take a screenshot of the initial form state
  .screenshot('Initial')
  .do(fillForm())
  // Name the final screenshot 'Filled'
  .screenshot('Filled');
```

### Masking {#masking}

Elements can be masked on screenshots, which can be useful when working with dynamically changing data:

```ts
actor
  .do(fillForm())
  // Mask the component displaying time
  .screenshot('Filled', { mask: [finder.get(appClock())] });
```

:::warning Attention
This property is recommended to be used as rarely as possible, as it reduces regression protection. Prefer [alternative methods](/patterns/replace) for [mocking external dependencies](/specification/requirements/query).
:::

## uploadFile {#uploadfile}

Uploads one or more files to the target element:

```ts
actor.uploadFile(finder.get(uploadTrigger()), 'path/to/file_0.ext');
```

:::note
The first argument to `uploadFile` accepts the element that triggers the file dialog when clicked.
:::

:::tip
File paths are resolved relative to the project's working directory. Therefore, it is recommended to keep them in a single location for simplicity:

```ts
function getPath(file: string) {
  return `/src/storyshots/externals/files/${file}`;
}

actor.uploadFile(finder.get(uploadTrigger()), [
  getPath('file_1.ext'),
  getPath('file_2.ext'),
]);
```

:::

## do {#do}

Allows extending user actions using special transformers:

```ts
function enterCredentials(): ActorTransformer {
  return (actor) =>
    actor
      .fill(finder.getByRole('username'), 'user')
      .fill(finer.getByRole('password'), 'pass');
}

actor.do(enterCredentials());
```

The function also accepts [story configuration](/API/test-components/story-config) as a second argument:

```ts
function closePopup(): ActorTransformer {
  return (actor, config) =>
    config.device.name === 'mobile'
      ? actor.do(swipe())
      : actor.click(finder.get(cross()));
}
```

## toMeta {#tometa}

Converts actor actions to meta objects used by `storyshots`.

:::note
When the resulting array is empty, the test is considered empty and is not run by the test runner.
:::

## stop {#stop}

Stops execution of all subsequent actions:

```ts
actor
  .hover() // Will execute
  .stop() // After this point, all subsequent actions will not be executed
  .click()
  .fill();
```

:::warning Attention
This method is intended solely for debugging.
:::

## exec {#exec}

Executes the provided function in the page context.

```ts
actor
  .do(submit())
  // Will run immediately after submit
  .exec(() => window.alert('Code has been injected'));
```

:::warning Attention
Functions passed to `exec` cannot have [external dependencies](/specification/requirements/query) except for global `Browser API` objects.
:::
