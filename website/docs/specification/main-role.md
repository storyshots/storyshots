---
sidebar_position: 1
---

# Task {#task}

Modern applications can have complex internal architectures and often implement intricate behavior scenarios.

Moreover, such systems are **constantly evolving**. With each new commit, defects are fixed and new features are added, thereby **increasing the complexity** of the source code.

## Complexity {#complexity}

Simply put, complexity can be described as a factor affecting the time required to complete tasks in a project. The more complex the project, the more time will be spent on task execution.

:::note
It is not uncommon for the execution time of only certain tasks to increase.

For example, in a project with a large amount of duplication, it is easy to **add** new functionality. However, **changing** existing functionality will be much **more difficult**.

This distribution is directly dependent on the chosen application architecture.
:::

## Refactoring {#refactoring}

Developers, recognizing this trend, take measures to control software complexity.

One such measure is *refactoring*.

:::note
**Refactoring** is the process of changing a program's source code without altering its observable behavior.
:::

## Tests {#tests}

The challenge lies in simplifying the system without causing *regression*.

:::note
**Regression** is a phenomenon in which the system loses its expected observable behavior.
:::

Here, *tests* come to the rescue. Their primary purpose is to **protect against regression**, but this is not their only role.

:::note
**Tests** are programs that verify the properties and behaviors of another program.
:::

Let's examine the problems that arise when testing applications.