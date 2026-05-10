import { MetricsTip, Metric } from '@site/src/MetricsTip';


# Work Order {#work-order}

Golden master testing contains certain nuances of usage. `storyshots` is no exception, and the following recommendations are provided for working in various conditions.

## Work Scenarios {#work-scenarios}

<MetricsTip improves={[Metric.RegressionProtection, Metric.Maintainability]} />

To improve testing efficiency, it is recommended to follow these practices:

### When Developing Without API {#when-developing-without-api}

If a ready API is not available at the start of work, it is recommended to:

1. Agree on contracts with the backend developer
2. Implement stubs in `externals` according to the agreed contracts
3. Describe `storyshots` stories according to requirements
4. Generate a baseline and save it in the baseline repository
5. Perform integration once the API is ready

:::note
The finer the layers of interaction with the server ([*queries*](/specification/requirements/query) and [*commands*](/specification/requirements/command)), the more frontend functionality can be developed without backend implementation.
:::

:::tip
Baseline lists can be used as a documentation source, for example, when searching for already implemented components in the system.
:::

:::warning Attention
If the contract is changed after backend implementation, stubs must be adjusted and the steps above repeated.
:::

### When Developing With API {#when-developing-with-api}

If a ready API is available at the start of work, it is recommended to:

1. Form a contract based on actual API methods
2. Implement stubs in `externals` based on existing contracts
3. Describe `storyshots` stories according to requirements
4. Generate a baseline and save it in the baseline repository
5. Perform integration with the actual API method

:::note
Steps 1 and 2 can be skipped if stubs were already implemented earlier.
:::

:::tip
It is recommended to populate stubs with data from mockups, even if real APIs return non-empty information.
:::

### When Handling Defects {#when-defect}

Defects are an inevitable part of any project. However, given that `storyshots` tests are in place, special attention should be paid to the root cause of the defect’s appearance. Why did the tests pass, yet the defect still exists?

The recommended sequence of actions is as follows:

1. Set up stubs. HAR snapshots of network queries can be used.
2. Set up actions. Steps to reproduce can be used.
3. Write a story where the defect is reproduced.
4. Fix the defect.
5. Ensure the defect no longer occurs in the story.
6. Commit the baseline.
7. Verify in a real environment.

Thus, this defect will not reoccur under the given preconditions.

:::tip
Following this strategy makes application development resemble an _iterative_ process, where each new version is more stable than the previous one.
:::

:::note
It should be understood that `storyshots` does not test the application as a whole. On the contrary, the library strikes a balance between test maintainability and the protection they provide. Therefore, it is perfectly normal for some defects to be detected without being caught by tests.
:::

### When Refactoring {#when-refactoring}

`storyshots` greatly supports refactoring by providing protection against accidental regressions. The recommended workflow is as follows:

1. Define the scope of work
2. If the refactoring is large, break it into sub-steps
3. After each step, run tests in UI mode
4. After completing a step and running tests, commit the changes.
5. Repeat steps 3 and 4 until all work is complete

## Baseline Separation {#baseline-separation}

<MetricsTip improves={[Metric.RegressionProtection]} degrades={[Metric.Maintainability, Metric.Speed]} />

`storyshots` verifies application behavior by comparing baselines of its behavior. Most often, these are screenshots.

Numerous advantages of visual testing are offset by significant drawbacks, one of which is high sensitivity to the execution environment. Two main categories can be identified:

- [*Queries*](/specification/requirements/query) — substituted programmatically
- Execution environment — manually controlled

:::note
The operating system and even specific hardware affect the final screenshot result.
:::

In team development, different machines with different operating systems are used. For such cases, the following workflow is proposed:

![scheme](@site/assets/ci-scheme.drawio.png)

- **Local Baseline** — a unique baseline for each developer. Excluded from VCS.
- **Global Baseline** — a shared baseline used as a single source of truth for correct behavior. Generated on a single server.

:::note
Creating a global baseline is done in [background mode](/API/run-modes/runCI). CI/CD template implementations can be found [here](https://github.com/storyshots/storyshots/tree/master/examples/ci-templates).
:::

In this setup, the recommended workflow during development is:

- Create a branch for a specific task
- Generate a local behavior baseline
- Develop stories and create new screenshots in the local baseline
- Upon completion, create a merge request (MR)
- Within the request, run a script that generates a global baseline from this branch
- Automatically commit the global baseline into the branch
- Reviewer examines the MR together with screenshots from the global baseline

:::tip
Logs are not environment-sensitive, so they do not need to be separated.
:::

:::warning Attention
If a regression occurs in the MR, do not simply restart CI/CD to regenerate the global baseline. Instead, revert the previous baseline generation commit to avoid cluttering the history and confusing the MR reviewer.
:::
