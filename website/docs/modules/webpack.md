---
sidebar_position: 3
---

# @storyshots/webpack

[Сервер](/modules/scheme#ipreviewserver) `preview` использующий сборщик `webpack`.

:::tip
`@storyshots/webpack` подходит для приложений использующих `webpack` для `dev` сборки.
:::

## createWebpackWatchServer

Создаёт сервер превью (на базе `webpack watch`). В качестве аргумента принимает стандартную конфигурацию `webpack`.

```ts
import { ManagerConfig } from '@storyshots/core/manager';
import { createWebpackWatchServer } from '@storyshots/webpack';

export default {
  preview: createWebpackWatchServer({
    entry: '/path/to/preview.tsx',
    /* webpack конфигурация */
  }),
  /* ... */
} satisfies ManagerConfig;
```

:::note
В качестве `entry` должен указываться файл с инициализацией `preview`.
:::

### live reload

Для автоматического перезапуска историй при изменении кода, необходимо добавить `'@storyshots/webpack/client'`
в `entry`:

```typescript
{
  // client должен идти первым в списке entry
  entry: ['@storyshots/webpack/client', '/path/to/preview.tsx']
  /* webpack конфигурация */
}
```

## createWebpackStaticServer

Создаёт сервер статичного контента собранного с помощью `webpack`:

```typescript
import { ManagerConfig } from '@storyshots/core/manager';
import { createWebpackStaticServer } from '@storyshots/webpack';

export default {
  preview: createWebpackStaticServer(
    // Путь до root папки артефакта сборки
    '/dist',
    {
    entry: '/path/to/preview.tsx',
    /* webpack конфигурация */
  }),
  /* ... */
} satisfies ManagerConfig;

```

:::tip
`createWebpackStaticServer` полезен при [`ci`](/API/manager/runInBackground) режиме `storyshots`. 
:::