---
sidebar_position: 2
---

# filter

Отсеивает [истории](/specification/requirements/borders) не удовлетворяющие предикату:

```ts
// Оставляем истории в тексте которых упоминается user
filter(stories, (story) => story.title.includes('user'));
```

:::note
`filter` только исключает выделенные истории из запуска.

В UI-режиме истории по-прежнему будут отображаться.
:::
