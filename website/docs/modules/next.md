---
sidebar_position: 8
---

# @storyshots/next

Реализует [`клиент`](/specification/scheme#ipreviewclient) и [`сервер`](/specification/scheme#ipreviewserver) preview для `nextjs` приложений.

Для интеграции необходимо:

## Externals

Описать базовые контракты внешних зависимостей:

```ts
export type Externals = {
  // В тестах подменяется функция getPosts
  getPosts(): Promise<Post[]>;
};
```

## createStoryFactories

Связать базовые фабрики с типом `Externals` и указать реализации по умолчанию:

```ts
import { createStoryFactories } from '@storyshots/next';
// Описывает подменяемые в тестах зависимости
import { Externals } from '@/storyshots/arrangers';

// Инициализация фабрик историй и утилит
export const { it, describe, each, createOnStorySwitch } = createStoryFactories<Externals>({
  // Определение поведения "по умолчанию" для внешних зависимостей
  createExternals: () => ({ getPosts: async () => [] }),
  // Маркировка методов для записи в журнал вызовов
  createJournalExternals: (externals) => externals,
});
```

:::note
Подробнее фабрики по умолчанию описываются в [данном разделе](/modules/react#externalsfactory).
:::

## createOnStorySwitch

Используя специальную функцию переключатель, описать механизм подмены зависимостей:

```ts
import { stories } from '@/storyshots/stories';

// createOnStorySwitch связывает фабрики с описанными историями
const onStorySwitch = createOnStorySwitch(stories);

// Далее, можно описать две инструкции инициализации зависимостей
const getPosts = onStorySwitch({
  // В тестовом окружении будет использоваться специальное поведение
  onStory: (externals) => externals.getPosts,
  // В реальном окружении выполняется настоящий запрос
  otherwise: () => () => fetch('...'),
});
```

:::warning
`createOnStorySwitch` рекомендуется использовать только для подмены зависимостей в основных точках входа, чтобы избежать
утечки тестовых зависимостей.
:::


## createStoryRootComponent

Связать `Root` компонент с описанными историями:

```ts title="Root.tsx"
'use client';

import { createStoryRootComponent } from '@storyshots/next/client';

import { stories } from '@/storyshots/stories';

export const Root = createStoryRootComponent(stories);
```

Далее, компонент необходимо подключить как корневой:

```tsx
import React from 'react';
import { Root } from '@/storyshots/Root';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
```

## ModeInjector

Следующим шагом необходимо подключить `ModeInjector`:

```tsx
import React from 'react';
import { Root } from '@/storyshots/Root';
import { ModeInjector } from '@storyshots/next/client';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <head>
        {/* Должен выполняться до любого другого CSR кода на проекте */}
        <ModeInjector />
      </head>
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
```

## createNextPreview

Далее подключить сам сервер превью:

```ts
import { ManagerConfig } from '@storyshots/core/manager';
import { createNextPreview } from '@storyshots/next/preview';

export default {
  preview: createNextPreview(),
  /* ... */
} satisfies ManagerConfig;
```

## extendNextConfig

Расширить конфигурацию `nextjs`:

```ts
import type { NextConfig } from 'next';
import { extendNextConfig } from '@storyshots/next/preview';
import path from 'node:path';

const nextConfig: NextConfig = extendNextConfig({
  // Путь до файла где экспортируются истории
  storiesRoot: path.join(process.cwd(), 'storyshots', 'stories'),
  config: {
    // Оригинальная конфигурация nextjs
  },
});

export default nextConfig;
```

:::note
`extendNextConfig` исключает тестовый код из production артефакта.
:::

После этого можно описывать [истории](/specification/requirements/borders) как обычно:

```ts
[
  it('shows empty posts', {}),
  it('shows few posts', {
    arrange: (externals) => ({ ...externals, getPosts: async () => createFewPostsStub() })
  }),
  // ... //
];
```

## createSharedState

Позволяет эмулировать stateful поведения в историях:

```ts
it('allows to create post', {
  arrange: (externals) => {
    // Состояние будет идентичным не зависимо от runtime функций
    const posts = createSharedState<Post[]>('posts', []);
    
    return {
      ...externals,
      createPost: (body) => posts.update((all) => [...all, { ...body, id: all.length }]),
      getPosts: () => posts.get()
    };
  }
});
```

:::note
`createSharedState` создаёт общее состояние для браузерного и серверного окружения, но изолирует данные в рамках взятой
истории.
:::

## Расширения

`@storyshots/next` дополнительно расширяет фабрику [it](/API/factories/it) следующими элементами:

### at

Принимает стартовый `url` истории:

```tsx
[
  it('renders home page', {
    // Откроет приложение по корневому адресу (поведение по умолчанию)
    at: '/',
  }),
  it('renders products', {
    // Сразу откроет список продуктов
    at: '/products',
  })
];
```

### arrange

Подготавливает внешние зависимости для истории.

Эта функция используется для подготовки окружения перед запуском истории.

```ts
it('...', {
  arrange: (externals) => ({
    ...externals,
    // Для текущей истории установить определённое поведение метода.
    getUser: async () => ({ name: 'John Doe', age: 25 }),
  }),
});
```

Принимает [конфигурацию истории](/API/test-components/story-config) как второй аргумент.

Может также использоваться для разметки методов для логирования с помощью [Journal]/API/test-components/story-config#journal:

```ts
it('...', {
  arrange: (externals, { journal }) => ({
    ...externals,
    getUser: journal.asRecordable('getUser', externals.getUser),
  }),
});
```

:::note
`journal.record` и `journal.asRecordable` работают только с асинхронными функциями.
:::

Также может использоваться для хранения временного состояния в контексте истории:

```ts
it('...', {
  arrange: (externals) => {
    // count сохранится в контексте работающей истории.
    const count = createSharedState('count', 0);

    return {
      increment: () => count.update(value => value + 1),
      get: () => count.get(),
    };
  },
});
```
