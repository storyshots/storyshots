# Package Overview

`website` contains docs describing public `storyshots` APIs using markdown files.

# Structure

`./docs` - contains documentation written in English, this is the main source of information.

# Rules

* Every public API that is exported from packages must be documented here.
* Every heading MUST define an explicit id in kebab-case format (for example: `{#my-heading}`).
* If a heading represents an identifier name, its id MUST use lowercase form of that identifier (for example: `toMeta` -> `{#tometa}`).
* If any heading id is changed, all related JSDoc and documentation references MUST be updated and verified in the same change.

# Validation

DO NOT run any general checking scripts when editing docs.
