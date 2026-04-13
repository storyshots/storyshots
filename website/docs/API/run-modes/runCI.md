---
sidebar_position: 2
---

# runCI {#runci}

Runs tests in the background, the main use case is [CI/CD processes](/patterns/application#baseline-separation). Accepts [StoryshotsConfig](/API/run-modes/storyshots-config) as an argument.

## Features {#features}

- **Automatic baseline update** - `storyshots` will automatically update the baseline if the application behavior for existing tests has changed or new stories have been added. The developer must independently determine the presence of regressions by analyzing these changes.
- **Exception propagation** - if one or more tests fail to execute (e.g., an element was not found), `runCI` will throw an exception after completing all stories and display a list of all errors.
- **Flaky test detection** - if any test fails on the first attempt during execution, it will be marked in the final test report.

