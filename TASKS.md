DO NOT READ/USE THIS FILE IF YOU ARE AN AGENT.

# Tasks Overview

Contains tasks to be done. Sorted by priority and grouped by type (Feature/Fix).

# Features

# Fixes

## Implement import sort using eslint

Priority: MAJOR

Implement import sorting using eslint so that all imports are placed consistently.

## Rewrite @storyshots/next documentation

Priority: AVERAGE

`@storyshots/next` documentation must have same format with what `@storyshots/react` has. It also needs to be actualized
with current state of its APIs. (`previewing` specifically)

## Explain stories target runtime choose

Priority: CRITICAL

Explain why browser runtime was chosen as a target runtime for story declarations (and not separate node.js runtime
like in jest for example). Here are some points:

* `storyshots` main purpose is integration based testing of UI logic inside a browser. So there is no point in testing
  when there is no browser (no visible UI).
* One build tool for app and for stories
    * Simpler setup (no runtime mismatch issues, extra build steps, extra processes)
    * Synchronized HMR updates, plugins, rules and other bundler features
    * Increased protection against regression (bundler runtime is native to storyshots)
* Same thread
    * Since story is run on the same thread as AUT, one can easily affect how AUT is
      executed by directly manipulating app's dependencies in memory.
    * `arrange` often depend on components that AUT uses. It is useful for story to reuse them, so that they become
      more maintainable. But, it comes at a cost of increasing coupling which is neglected by specific patterns.
* Easier to reuse AUT entities.
    * Reusing app components inside stories is as simple as to do it in target env. Developer does not need to
      constantly check for platform specific dependencies to bleed in because runtime is the same.
* For isomorphic, hybrid apps (like `next.js`) `storyshots` allows declaring runtime shared stories as it would be done
  for an app itself.
* For polymorphic, hybrid apps `storyshots` provides `AppArgs` to `AppServerFactory` containing platform-agnostic meta
  suitable for preparing an app for stories exploration or emulation.
