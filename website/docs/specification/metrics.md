---
sidebar_position: 3
---

# Metrics {#metrics}

Tests are code too, and their quality requires careful oversight. But to manage something, you must be able to *measure* it.

Let's examine the key metrics:

## 🛡️ Regression Protection {#regression-protection}

One of the main functions of tests is **regression protection**. It helps avoid unintended changes in application behavior when modifying implementation details, reducing the likelihood of accidental errors.

## 🔧 Refactoring Resilience {#refactoring-resilience}

Tests should not hinder refactoring or significantly increase its time cost. Refactoring code should be **invisible** to tests.

## 📈 Maintainability {#maintainability}

Tests should be **simple to write and update**. If they require substantial resources to maintain, the entire effort to optimize development is undermined—making it simpler to just not write them at all.

## ⚡ Performance {#performance}

If tests run too **slowly**, they will be executed less frequently. Less frequent execution increases the likelihood of defects appearing, making them harder to detect. In the worst case, long-running tests are ignored entirely, reducing their value to zero. This also **negatively impacts the speed and fluidity of refactoring**.

:::note
`storyshots` places special emphasis on performance, partly due to its dedicated UI mode, where interactivity demands high test execution speed.
:::

Having defined these measurements, you can establish a set of [requirements](/specification/requirements/borders) aimed at maximizing them.
