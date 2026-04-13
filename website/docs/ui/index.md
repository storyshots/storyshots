---
sidebar_position: 3
---

# UI Mode {#ui-mode}

UI Mode is a special application that provides interactive access to running, updating, and viewing stories, as well as developing the core functionality, exactly in the same format as in a regular browser.

The overall interface looks like this:

![.](@site/assets/ui/main-aria.png)

## Navigator {#navigator}

On the left side is the navigator, which allows you to view the list of all stories:

![.](@site/assets/ui/navigator.png)

## Preview {#preview}

Clicking on a story opens an interactive preview mode:

![.](@site/assets/ui/preview.png)

During preview, `storyshots` performs the following actions:

1. Prepares external data sources using the `arrange` function.
2. Launches the application and displays the UI in the preview area.
3. Interacts with the interface automatically (the `act` function).

Thus, the application state is automatically prepared, providing the developer with a ready-to-use environment for work.

:::note test-assistance
`storyshots` allows you to develop and debug using browser tools without leaving the test writing mode.
:::

:::tip
To restart the preview, simply click on the selected story again.
:::

## Run {#run}

When hovering over a story or a group of stories, additional actions appear, such as running a test scenario:

![.](@site/assets/ui/run-action.png)

After running, a fresh baseline is generated, and its status relative to the reference is displayed:

![.](@site/assets/ui/fresh.png)

:::note
On the first test run, the baseline is marked as "new" (blue circle).
:::

## Log {#log}

The log is part of the behavior baseline. You can view it by clicking on the "Records" item:

![.](@site/assets/ui/fresh-records.png)

The "Accept" button in the top-right corner allows you to accept the log baseline, making it part of the reference:

![.](@site/assets/ui/accepted-journal.png)

:::note
Accepted logs are marked with a green checkmark.
:::

## Snapshots {#snapshots}

Screenshots form the main part of the application behavior baseline. To view a specific screenshot, select its name from the list:

![.](@site/assets/ui/fresh-screenshot.png)

:::note
"FINAL" is the default name for screenshots automatically created after completing actions in a story.
:::

The "Accept" button allows you to accept the screenshot as a reference, confirming the current application behavior as correct.

![.](@site/assets/ui/accepted-screenshot.png)

:::note
A story is considered passed only if its entire baseline matches the reference.
:::

:::tip
Logs and screenshots can be accepted separately.
:::

## Bulk Actions {#bulk-actions}

`storyshots` allows running multiple stories simultaneously:

![.](@site/assets/ui/bulk-run.png)

After execution, baselines are generated, which can be accepted all at once:

![.](@site/assets/ui/bulk-accept.png)

Result:

![.](@site/assets/ui/bulk-accept-result.png)

## Log Changes {#log-changes}

Consider a regression scenario. Initially, the log looks like this:

![.](@site/assets/ui/actual-journal.png)

Remove the call from the code:

```ts title="Before"
externals.analytics.log('worked hard');
```

```ts title="After"
// externals.analytics.log('worked hard');
```

After restarting the test, `storyshots` detected a difference between the current log and the reference. The red cross indicates a mismatch.

Open the log:

![.](@site/assets/ui/fail-journal.png)

Here, the difference between the current and reference behavior is visible. The "Accept" button allows you to accept the current baseline as correct.

## Snapshot Changes {#snapshot-changes}

Consider a story with an intermediate snapshot:

![.](@site/assets/ui/inter-screens.png)

Change the text on the page:

```txt title="Before"
Account Balance (RUB)
```

```txt title="After"
My balance (RUB)
```

After restarting:

![.](@site/assets/ui/failed-screens.png)

Each snapshot contains the difference. Example:

![.](@site/assets/ui/inter-diff-screen.png)

Left — reference snapshot (red outline), right — current snapshot (green outline).

For a more explicit highlighting of differences, the change map is also available:

![.](@site/assets/ui/inter-diff-image.png)

## Errors {#errors}

If a baseline cannot be generated, for example due to a missing element, the story is marked with an exclamation point:

![.](@site/assets/ui/error-story.png)

To learn more details, click on the status in the top-left corner:

![.](@site/assets/ui/status-btn.png)

The error details panel will open:

![.](@site/assets/ui/error-details.png)

:::note
`storyshots` uses the `playwright` library to interact with the interface.
:::

:::tip
The "Failures" tab contains a list of stories whose baselines differ from the reference.
:::

## Locator {#locator}

To simplify working with selectors, the "Locator" tool is used. It is located on the toolbar (eye icon):

![.](@site/assets/ui/loc-story.png)

When activated and hovering over an element, a recommended selector is displayed:

![.](@site/assets/ui/loc-help.png)

:::tip
Clicking on an element in "Locator" mode copies its selector to the clipboard.
:::

## Device Selection {#device-selection}

If `storyshots` is configured for multiple devices, you can select a device via the configuration panel:

![.](@site/assets/ui/config-btn.png)

The panel looks like this:

![.](@site/assets/ui/config-panel.png)

Select a device, for example, "mobile":

![.](@site/assets/ui/mobile-sel.png)

Now baselines will be generated for the selected device:

![.](@site/assets/ui/mobile-fresh.png)

## Full Run {#full-run}

Stories can be run simultaneously across multiple devices. To do this, select them in the configuration panel:

![.](@site/assets/ui/run-comp.png)

Result:

![.](@site/assets/ui/devices-fresh.png)

:::note Attention
The more devices used, the faster the test execution time will grow on the project.
:::

## Emulation {#emulation}

By default, the preview mode displays the application according to the size of the working window:

![.](@site/assets/ui/def-preview.png)

To enable emulation, select the desired device in the "Device to emulate" option. Now the working area will automatically adjust to the viewport of the selected device:

![.](@site/assets/ui/em-preview.png)

:::note
`storyshots` does not fully emulate the device, but only sets the specified screen dimensions.
:::

