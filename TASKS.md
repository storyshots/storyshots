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

Explain why browser runtime was chosen as a target runtime for story declarations. Here are some points:

* `storyshots` main purpose is integration based testing of UI logic inside a browser
* One build tool for app and for stories
    * Simpler setup (no runtime mismatch issues, extra build steps, extra processes)
    * Synchronized HMR updates, plugins, rules and other features
    * Increased protection against regression (bundler runtime is native)
* Easier to manipulate externals (`arrange`).
    * Since story is run on the same thread (browser -> frame -> thread) as AUT, one can easily affect how AUT is
      executed by directly manipulating app's dependencies in memory.
    * `arrange` often depend on components that AUT uses. It is useful for story to reuse them, so that they become
      more maintainable. But, it comes at a cost of increasing coupling which is neglected by specific patterns.
* Easier to implement `act`.
    * For integration based testing it is important to maintain direct control on acting phase of an AUT, so that only
      what's necessary is being verified. This direct control requires for a solution to provide a way for a developer
      to manipulate with an app at specific component level. It should be noted though, that specifying too much detail
      inside a story is disregarded as it increases coupling.
* Easier to reuse AUT entities.
    * Reusing app components inside stories is as simple as to do it in target env. Developer does not need to
      constantly check for platform specific dependencies to bleed in because runtime is the same.
* `storyshots` handles SSR based app's by providing `AppArgs` to `AppServerFactory`, so that server runtime is
  able to `arrange` and `act` correctly.
    * For isomorphic processes (such as rendering in Next.js) there are not limits because stories is being adapted to
      both runtimes automatically by build system (stories are lazy by design and may not depend on CSR specific
      functions).
    * For node.js specific functions one can exploit dependency inversion based patterns (e.g. command + driver,
      factory + strategy) to avoid referencing specific packages and yet to declare desired testable behaviour.
