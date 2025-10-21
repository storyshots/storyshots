---
sidebar_position: 7
---

# @storyshots/middleware

[Сервер](/modules/scheme#ipreviewserver) `preview` проксирующий обращения на переданный адрес.

## createProxyServer

Создает `middleware` до заданного сервера:

```ts
import { ManagerConfig } from '@storyshots/core/manager';
import { createProxyServer } from '@storyshots/middleware';

export default {
    preview: createProxyServer('http://localhost:3000'),
    /* ... */
} satisfies ManagerConfig;
```

:::warning Важно
`@storyshots/middleware` следует рассматривать как временное решение при интеграции `storyshots` в проект.

Модуль хоть и позволяет облегчить интеграцию, однако не поддерживает некоторые из функций, такие как автоматическая
перезагрузка историй, а также не позволяет интегрировать UI режим в полной мере.
:::