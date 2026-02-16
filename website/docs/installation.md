---
sidebar_position: 2
---

# Быстрый старт

`storyshots` легко интегрируется даже в уже написанные приложения благодаря своей [архитектуре](/specification/scheme).

## Установка и сборка

:::note
На данный момент библиотека не публикуется ни в один из реестров пакетов, ввиду наличия не стабильной структуры пакетов.
Компоненты устанавливаются из локальных артефактов, а не из публичного registry.
:::

В корне [проекта](https://github.com/storyshots/storyshots) установить зависимости:

```shell
npm install
```

Собрать пакеты и запаковать в архив:

```shell
npm run build && npm run pack
```

## Интеграция в проект

По итогу будут сформированы артефакты `.tar`. Описание данных компонентов можно найти в
разделах [архитектура](/specification/scheme) и [модули](/modules/).

:::tip
Для стандартного [CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR) проекта, использующего `react`, будет достаточен следующий набор:

- `@storyshots/core` - ядро `storyshots`.
- `@storyshots/react` - клиент preview `react` приложений.
- `@storyshots/exec-preview` - сервер preview.
  :::

Данные модули необходимо разместить в папке проекта и поместить их под контроль VCS:

```plaintext
project/
├── src/
├── offline/
│   ├── @storyshots-core-0.0.20.tgz
│   ├── @storyshots-react-0.0.20.tgz
│   └── @storyshots-exec-preview-0.0.20.tgz
└── package.json
```

Далее зависимости необходимо зарегистрировать:

```json title="package.json"
{
  "devDependencies": {
    "@storyshots/core": "file:offline/storyshots-core-0.0.20.tgz",
    "@storyshots/react": "file:offline/storyshots-react-0.0.20.tgz",
    "@storyshots/exec-preview": "file:offline/storyshots-exec-preview-0.0.20.tgz"
  }
}
```

И установить:

```shell
npm i
```

## Описание превью

:::note
Связанные со `storyshots` файлы в данном руководстве располагаются в `src/storyshots` (см. [дислокация тестов](/patterns/files#дислокация-тестов)).
:::

После установки всё готово для описания [клиента preview](/specification/scheme#ipreviewclient) и первых историй. Начнём с preview:

```ts title="/src/storyshots/preview/config.ts"
import { createPreviewApp } from '@storyshots/react';

// Инициализация превью
export const { it, run } = createPreviewApp({
  /*
   Определение поведения "по умолчанию" для внешних зависимостей.
   В данном случае это методы BE API.
  */
  createExternals: (config) => ({
    getUser: async () => ({ id: 1, name: 'John Doe' }),
  }),
  // Маркировка методов для записи в журнал вызовов
  createJournalExternals: (externals, config) => ({
    getUser: config.journal.asRecordable('getUser', externals.getUser),
  }),
});
```

После, опишем первые истории:

```tsx title="/src/storyshots/stories/index.tsx"
import { finder } from '@storyshots/core';

import { it } from '../preview/config';

export const stories = [
  it('renders the application correctly'),
  it('handles missing user gracefully', {
    // Модифицируем поведение сервера для данной истории
    arrange: (externals) => ({ ...externals, getUser: async () => null }),
  }),
  it('allows to login', {
    // Эмулируем действия на странице
    act: (actor) => actor.click(finder.getByRole('button', { name: 'Login' })),
  }),
];
```

:::tip
Истории можно [декомпозировать](/patterns/stories#разделение-историй).
:::

После чего, запустим описанные истории реализовав [render по умолчанию](/patterns/stories#универсальный-render) с [внедрением зависимостей](/patterns/replace#подмена-через-инверсию):

```tsx title="/src/storyshots/preview/index.tsx"
import { map } from '@storyshots/core';

import { run } from './config';
import { stories } from '../stories';

run(
  map(stories, (story) => ({
    render: (externals) => (
      <Externals externals={externals}>
        <App />
      </Externals>
    ),
    ...story,
  })),
);
```

## Описание менеджера

Далее необходимо описать [сервер preview](/specification/scheme#ipreviewserver):

```ts title="/src/storyshots/manager/createAppServer.ts"
import { createExecPreview } from '@storyshots/exec-preview';

export function createAppServer() {
  return createExecPreview({
    ui: {
      command: 'npx webpack-cli serve', // <- Скрипт запускающий приложение в dev режиме
      at: 'http://localhost:8080', // <- Адрес dev сервера
    },
    ci: {
      command: 'npx webpack-cli build', // <- Скрипт сборки артефакта
      serve: './dist', // <- Расположение артефакта сборки
    },
  });
}
```

Также необходимо настроить используемый сборщик (в данном примере используется `webpack`), указав верный `entry`:

```ts title="webpack.config.ts"
export default {
  entry:
    // process.env.STORYSHOTS выставляется @storyshots/exec-preview автоматически
    process.env.STORYSHOTS === 'true' // <- Выставляем entry до preview взависимости от режима сборки.
      ? './src/storyshots/preview/index.tsx'
      : './src/index.tsx',
  // ... ///
};
```

:::tip
Более подробно про `@storyshots/exec-preview` можно прочитать в [данном разделе](/modules/exec).
:::

После описания сервера, нужно определить общую конфигурацию тестирования:

```ts title="/src/storyshots/manager/config.ts"
import { ManagerConfig } from '@storyshots/core/manager';

import { createAppServer } from './createAppServer';

export default {
  // Список тестируемых устройств
  devices: [
    {
      name: 'desktop',
      width: 1480,
      height: 920,
    },
  ],
  // Описание путей до основных артефактов: снимков и журналов
  paths: {
    screenshots: path.join(process.cwd(), 'screenshots'),
    records: path.join(process.cwd(), 'records'),
  },
  // Описание сервера превью
  preview: createAppServer(),
} satisfies ManagerConfig;
```

:::tip
Список всех доступных настроек доступен в [данном разделе](/API/run-modes/manager-config).
:::

Далее UI режим запустить с помощью

```shell
storyshots --ui /src/storyshots/manager/config.ts
```

:::note
Для запуска всех тестов в фоновом режиме использовать:

```shell
storyshots /src/storyshots/manager/config.ts
```

:::

## Примеры

- [**Пример #1**](https://github.com/storyshots/storyshots/tree/master/examples/basic-externals) - `react` + `webpack` + стандартные `fetch` запросы.
- [**Пример #2**](https://github.com/storyshots/storyshots/tree/master/examples/msw-externals) - `react` + `webpack` + `rtk-query`.
- [**Пример #3**](https://github.com/storyshots/storyshots/tree/master/examples/next-app) - `next.js`.
