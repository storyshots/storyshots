---
sidebar_position: 2
---

# @storyshots/react

Реализует [`клиент preview`](/specification/arch#ipreviewclient) для `react` приложений:

```ts
import { createPreviewApp } from '@storyshots/react';

// Инициализация превью
export const { it, describe, each, run } = createPreviewApp({
  // Определение поведения "по умолчанию" для внешних зависимостей
  createExternals,
  // Маркировка методов для записи в журнал вызовов
  createJournalExternals,
});

// Описание историй
const stories = [describe('...', it('...'))];

// Запуск клиента preview
run(stories);
```

## ExternalsFactory {#externalsfactory}

Позволяет задавать поведение и логирование по умолчанию для внешних зависимостей приложения.

---

### createExternals {#createexternals}

Основная фабрика, инициализирующая внешние зависимости приложения.
Принимает [StoryConfig](/API/test-components/story-config).

```ts
createPreviewApp({
  createExternals: () => {
    // Данное поведение будет использоваться по умолчанию в историях
    getUser: async () => DEFAULT_USER;
  },
  /* ... */
});
```

### createJournalExternals {#createjournalexternals}

Помечает функции в объекте `externals`, которые должны [отслеживаться](/specification/requirements/command#verification-method) по умолчанию. После того как функция
помечена как записываемая, это действие нельзя отменить.

Принимает итоговый `externals` и [StoryConfig](/API/test-components/story-config).

```ts
createPreviewApp({
  createJournalExternals: (externals, config) => ({
    ...externals,
    getUser: config.journal.asRecordable(externals.getUser),
  }),
});
```

## run {#run}

Помимо [фабрики тестов](/API/factories/it), возвращает функцию `run`, необходимую для запуска превью. Принимает
массив [историй](/specification/requirements/borders).

```tsx
const { run, it } = createPreview(/* ... */);

run([
  it('works', {
    render: (externals) => <App externals={externals} />,
  }),
]);
```

## Расширения {#extensions}

`@storyshots/react` дополнительно расширяет фабрику [it](/API/factories/it) следующими методами:

### render {#render}

Представляет собой само тестируемое поведение (для `react` приложений в частности, возвращает дерево компонентов для отрисовки).

Принимает `externals` и [StoryConfig](/API/test-components/story-config):

```tsx
it('...', {
  // Отрисовывает компонент UserProfile, используя подготовленные данные из externals.
  render: (externals) => <UserProfile externals={externals} />,
});
```

#### previewing {#previewing}

`@storyshots/react` расширяет `StoryConfig` добавляя новое свойство `previewing`, которое указывает режим, в котором
запущена история.

- `true`: История запущена в режиме [preview](/ui/#preview).
- `false`: История выполняется как тест в фоновом агенте.

:::note
Данное свойство полезно для контроля [внешней среды](/specification/requirements/query). Например, анимации должны быть
активны в режиме предпросмотра (для более наглядной разработки), но быть выключенными в режиме запуска тестов для
исключения недетерминированного поведения.
:::

### arrange {#arrange}

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

Также может использоваться для хранения временного состояния в контексте истории:

```ts
it('...', {
  arrange: (externals) => {
    // count сохранится в контексте работающей истории.
    const count = 0;

    return {
      increment: () => (count += 1),
      get: () => count,
    };
  },
});
```
