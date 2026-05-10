---
sidebar_position: 2
---

# Problems {#problems}

Testing applications is a non-trivial task; the main reasons for this are:

- **Dependency on external environment** (OS, browser, Web APIs, web services) — the more dependencies there are, the harder it is to reproduce the scenario.
- **Complex UI** — even the most basic interaction patterns are difficult to describe and automate from scratch.
- **Asynchronicity** — network queries, UI rendering, animations — all of this complicates behavior verification and interaction with the interface.
- **Complex structure** — modern applications have a complex structure, numerous dependencies, and a sophisticated build system. Tests inherit this complexity.
- **Responsiveness** — UI is often adaptive, both to devices and to finer user settings. These parameters must also be considered during testing.
- **Performance** — an application is a complex, distributed system with many components. The more components involved, the slower the tests run.

Additionally, it’s worth noting the lack of clear testing guidelines, which leads to problems such as:

- **Low coverage** — behavior is not fully verified.
- **Brittleness** — tests are hard and time-consuming to write.
- **Disconnection** — tests are written after the core functionality, or at the end of the project, due to imposed constraints.
- **Unreliability** — manifested in *false negatives*. Tests pass, but the code is broken.
- **Fragility** — manifested in *false positives*. Tests fail, but the code works.

:::note
Poor tests are not a problem of tools — they are a consequence of the absence of a clear and *measurable* testing model.
:::

Let’s examine the main metrics that can be used to measure test quality **in a specific project**.
