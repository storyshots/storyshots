---
sidebar_position: 3
---

# @storyshots/webpack

[Сервер](/modules/scheme#ipreviewserver) `preview` использующий сборщик `webpack`.

:::tip
`@storyshots/webpack` подходит для приложений использующих `webpack` для `dev` сборки.
:::

## createWebpackServer

Создаёт сервер превью. В качестве аргумента принимает стандартную конфигурацию `webpack`.

```ts
import { ManagerConfig } from '@storyshots/core/manager';
import { createWebpackServer } from '@storyshots/webpack';

export default {
  preview: createWebpackServer({
    entry: '/path/to/preview.tsx',
    /* webpack конфигурация */
  }),
  /* ... */
} satisfies ManagerConfig;
```

:::note
В качестве `entry` должен указываться файл с инициализацией `preview`.
:::

## live reload

Для автоматического перезапуска историй при изменении кода, необходимо добавить `'@storyshots/webpack/client'`
в `entry`:

```typescript
{
  // client должен идти первым в списке entry
  entry: ['@storyshots/webpack/client', '/path/to/preview.tsx']
  /* webpack конфигурация */
}
```
