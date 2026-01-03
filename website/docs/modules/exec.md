---
sidebar_position: 7
---

# @storyshots/exec-preview

[Сервер](/specification/scheme#ipreviewserver) `preview`. Поднимает сервер приложения используя исходные скрипты проекта.

:::tip
`@storyshots/exec-preview` является рекомендуем сервером preview для большинства приложений.
:::

## createExecPreview

Создаёт сервер на базе переданных режимов разработки:

```ts
import { ManagerConfig } from '@storyshots/core/manager';
import { createExecPreview } from '@storyshots/exec-preview';

export default {
  preview: createExecPreview({
    ui: {
      command: 'npx webpack-cli serve', // <- Скрипт запускающий приложение в dev режиме
      at: 'http://localhost:8080', // <- Адрес dev сервера
    },
    ci: {
      command: 'npx webpack-cli build', // <- Скрипт сборки артефакта
      serve: './dist', // <- Расположение артефакта сборки
    },
  }),
  /* ... */
} satisfies ManagerConfig;
```

`createExecPreview` запускает команды выставляя `process.env.STORYSHOTS` в `true`:

```ts title="webpack.config.ts"
export default {
  entry:
    process.env.STORYSHOTS === 'true'
      ? './src/storyshots/preview/index.tsx' // <- Для storyshots меняем entry проекта
      : './src/index.tsx',
  // ... ///
};
```
