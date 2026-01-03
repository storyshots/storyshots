---
sidebar_position: 6
---

# @storyshots/msw-externals

Подменяет обращения к серверу [не инвазивным методом](/patterns/replace#подмена-через-сайд-эффекты), с помощью
библиотеки [`msw`](https://github.com/mswjs/msw).

## Endpoints

Хранит мета информацию о переопределённых эндпоинтах.

Подключение:

```ts
import { Endpoints } from '@storyshots/msw-externals';

type Externals = {
  // Мета описывается в общем типе Endpoints и хранится в externals.
  endpoints: Endpoints;
};
```

В качестве значения по умолчанию, в `preview` зоне указать пустой объект:

```ts
export const { run, it, describe } = createPreviewApp<Externals>({
  createExternals: () => ({ endpoints: {} as Endpoints }),
  createJournalExternals: (externals) => externals,
});
```

Далее эндпоинты регистрируются в `Endpoints` с помощью метода [`endpoint`](/modules/msw#endpoint).

## createMSWArrangers

Создаёт arrangers утилиты на базе [`@storyshots/arrangers`](/modules/arrangers):

```ts
import { createArrangers } from '@storyshots/arrangers';
import { createMSWArrangers, Endpoints } from '@storyshots/msw-externals';

// Создаются базовые функции arrabgers
const arrangers = createArrangers<Endpoints>();

const msw = createMSWArrangers(
  // Указываем путь до хранения Endpoints в externals
  arrangers.focus('endpoints'),
);
```

## endpoint

Добавляет новый эндпоинт в мету:

```ts
it('...', {
  arrange: endpoint('findPetsByStatus', {
    url: '/api/pet/findByStatus',
    // handle является опциональным
    handle: () => [],
  }),
});

declare module '@storyshots/msw-externals' {
  // Помимо описания эндпоинта необходимо аугментировать основной тип
  interface Endpoints {
    findPetsByStatus: Endpoint<FindPetsByStatusApiResponse>;
  }
}
```

:::note
Для того чтобы не дублировать определения `endpoint` можно вынести в отдельную функцию:

```ts
it('...', {
  arrange: setup(),
});

function setup() {
  return endpoint('findPetsByStatus', {
    url: '/api/pet/findByStatus',
    handle: () => [],
  });
}

declare module '@storyshots/msw-externals' {
  interface Endpoints {
    findPetsByStatus: Endpoint<FindPetsByStatusApiResponse>;
  }
}
```

:::

## record

Делает переданные методы отслеживаемыми, также может принимать реализацию:

```ts
it('...', {
  arrange: arrange(
    setup(),
    // Вызовы методов теперь будут записаны в журнал
    record('findPetsByStatus'),
    // Для данного метода также определено поведение
    record('getStatuses', () => [
      /* ... */
    ]),
  ),
});
```

## handle

Позволяет подменить поведение существующего эндпоинта:

```ts
it('...', {
  arrange: arrange(
    setup(),
    // Поведение findPetsByStatus теперь другое
    handle('findPetsByStatus', () => createFewPetsStub()),
  ),
});
```

## transform

Преобразует возвращаемое значение метода:

```ts
it('...', {
  arrange: transform('findPetsByStatus', (pets) => pets.slice(0, 2)),
});
```

:::note
Работает только с асинхронными функциями. Для всех других, рекомендуется [compose](/modules/arrangers#compose)
:::

:::tip
`endpoint`, `record` и `handle` являются такими же утилитами arrangers что и описанные в `@storyshots/arrangers`.

Для них работают те же правила и их спокойно можно комбинировать между собой.
:::

## toRequestHandlers

Преобразует `Endpoints` в нативные `RequestHandler`:

```ts
import { setupWorker } from 'msw/browser';

// Преобразуем мету в RequestHandler[]
const handlers = toRequestHandlers(externals.endpoints);

// Далее можно подключать msw в приложение как обычно
setupWorker(...handlers).start()
```

## params

Геттер параметров запроса:

```ts
it('...', {
  arrange: arrange(
    setup(),
    handle('findPetsByStatus', (args) => params(args).status === 'active' ? createPetsStub() : []),
  ),
});
```

## query

Геттер query-параметров запроса:

```ts
it('...', {
  arrange: arrange(
    setup(),
    handle('findPetsByStatus', (args) => query(args).page === '0' ? createPetsStub() : []),
  ),
});
```

## body

Геттер json-body запроса:

```ts
it('...', {
  arrange: arrange(
    setup(),
    handle('createPet', (args) => body(args).title === '' ? createErrorResponse() : createSuccessResponse()),
  ),
});
```

## native

Позволяет выбрасывать нативные `msw` исключения:

```ts
it('...', {
  arrange: arrange(
    setup(),
    handle('findPetsByStatus', () =>
      native(new HttpResponse(null, { status: 500 })),
    ),
  ),
});
```

:::warning Важно
`native` выбрасывает исключение поэтому его нельзя расширить через `transform`.
:::
