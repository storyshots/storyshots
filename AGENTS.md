# Repository Overview

This repository contains **Storyshots**, a framework for visual testing of web applications.

Storyshots is organized as a set of Nx packages that provide the core runtime, UI mode, adapters, integrations, mocking
utilities, and supporting tooling for running and observing story-based tests.

## Packages

- `./website` — docs package, more details in [documentation](#documentation) section
- `./utils` — utils package, consult each time implementing a feature
- `./packages/core` — core package exposing the main API for running an app and testing stories
- `./packages/ui` (WIP) — UI mode for Storyshots; connects to core through an Express server
- `./packages/mcp` (WIP) — MCP package that provides tools to run stories and fetch actual docs
- `./packages/arranges` (WIP) — mocking utilities based on the lenses pattern
- `./packages/exec-preview` (WIP) — app adapter package that provides bundler/server integration for `@storyshots/core`
- `./packages/msw` (WIP) — MSW wrapper for use with Storyshots
- `./packages/react` (WIP) — Pure React app adapter for Storyshots
- `./packages/next` (WIP) — Next.js app adapter for Storyshots
- `./packages/web-api` (WIP) — mocks for Web APIs

# Validation

When validating changes:

* use the `check` target
* do not invent extra validation steps

Preferred validation pattern:

```bash
npx nx run <package>:check
```

For example, to check `core` package, run:

```bash
npx nx run core:check
```

# Code Style Guidelines

## General

* Follow the existing repository style
* Keep changes minimal and scoped to the user request
* Prefer existing package structure and conventions over introducing new patterns
* Document inside `./website` every public API that is being created.

## Skill usage

DO NOT forget to search and use skills relevant to current task.

# Security and Operational Constraints

These rules are STRICT:

* Do not add dependencies
* Do not update dependencies
* Do not modify the lockfile unless explicitly requested
* Do not run install commands (`npm install`, `npm ci`, etc.) unless explicitly requested
* Do not commit changes
* Do not run repository scripts outside approved Nx commands
* Do not bypass Nx by calling underlying build tools directly when an Nx target exists
* Do not write missing package types for yourself, just respond their absence to the user

# Package-Level Guidance

This file defines repository-wide rules for agents.

When working inside a specific package, agents MUST read the closest package-local `AGENTS.md` (or `AGENT.md`) before making any changes in that scope.
Package-local guidance takes precedence over this repository-level file.

In case of conflict:

1. follow explicit user instructions
2. follow package-local guidance
3. follow this repository-level guide

# Documentation

`./website` contains md/mdx docs describing public `storyshots` api.

You MUST consult documentation when working with public APIs that reference docs:

```typescript
/**
 * https://storyshots.github.io/storyshots/API/test-components/story-config
 */
export type StoryEnvironment = {/* ... */ }

/*
 URL: https://storyshots.github.io/storyshots/API/test-components/story-config
 is decoded to ./website/docs/API/test-components/story-config.{md,mdx} file
*/
```

# Testing

DO NOT add or edit tests unless the user explicitly requests test changes.

When tests are failing due to snapshots diff:

* verify changes are expected
* if not, fix issues

When changes are expected, use to update snapshots:

```bash
npx nx run <package>:update-snapshots
```
