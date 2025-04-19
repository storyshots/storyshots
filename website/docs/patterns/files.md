---
sidebar_position: 7
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Структура файлов

Тесты - это тоже код, соответственно они также требуют к себе не меньшего внимания начиная с внутренним строением
функций, заканчивая внешней структурой файлов.

## Дислокация тестов

<MetricsTip improves={[Metric.RefactoringAllowance]} />

Истории и всю связанную с ними инфраструктуру лучше располагать подальше от основного кода. Это будет служить явной
границей между приложением и тестами.

:::tip
Тесты могут и должны влиять на кодовую базу, но только в строго определённых аспектах, а именно в *архитектуре*.
Приложение должно быть достаточно расширяемым, особенно в аспекте [внешней среды](/specification/requirements/env) для того чтобы
быть тестируемым.
:::

<p style={{ color: 'red' }}>Вместо этого:</p>

```plaintext
project/
├── src/
│   ├── User/
│   │   ├── index.tsx
│   │   └── stories.tsx <-- Тесты располагаются рядом с тестируемым функционалом
│   ├── api/
│   │   ├── userRepository.ts
│   │   └── mockUserRepository.ts <-- И моки в том числе
│   └── index.ts
└── package.json
```

<p style={{ color: 'green' }}>Делать это:</p>

```plaintext
project/
├── src <-- Код основного приложения
├── storyshots/ <-- Тесты и связанная с ними инфраструктура
│   ├── userStories.ts
│   ├── mockUserRepository.ts
│   └── index.ts
└── package.json
```

:::tip
Артефакты эталона: журналы и снимки можно располагать в корне репозитория, так как они часто используются как источник
документации:

```plaintext
project/
├── screenshots <-- Снимки
├── records <-- Журналы
├── src
├── storyshots
└── package.json
```
:::

## Виды компонентов

<MetricsTip improves={[Metric.Maintainability]} />

В тестах достаточно выделять следующие компоненты:

Компонент общей настройки окружения:

```ts
describe('User', [
  it('allows to login', {
    arrange: setup(),
    /* ... */
  }),
  it('allows to logout', {
    arrange: setup(),
    /* ... */
  }),
  it('allows to change password', {
    arrange: setup(),
    /* ... */
  }),
]);

// Все истории готовят окружение одинаковым образом, следовательно, функция setup является таким компонентом
function setup() {
  /* ... */
}
```

Функции частичного изменения окружения:

```ts
describe('User', [
  it('allows to login', {
    arrange: arrange(setup(), unauthorized()),
    /* ... */
  }),
  it('allows to logout', {
    arrange: arrange(setup(), authorized()),
    /* ... */
  }),
  it('allows to change password', {
    arrange: arrange(setup(), authorized()),
    /* ... */
  }),
]);

/**
 * Не смотря на общую логику инициализации, историям могут потребоваться частичные корректировки.
 * В эту категорию попадают функции отвечающие как раз за это.
 */
function authorized() {
  /* ... */
}

function unauthorized() {
  /* ... */
}

/* ... */
```

Функции взаимодействия с интерфейсом и работы с актором:

```ts
describe('User', [
  it('allows to login', {
    arrange: arrange(setup(), unauthorized()),
    act: (actor) => actor.do(enterCredentials()).do(submit())
    /* ... */
  }),
  it('allows to logout', {
    arrange: arrange(setup(), authorized()),
    act: (actor) => actor.click(finder.get(button('Выйти')))
    /* ... */
  }),
  it('allows to change password', {
    arrange: arrange(setup(), authorized()),
    /* ... */
  }),
]);

// Функции работающие с актором и селекторами принадлежат данной категории компонентов
function button() {
  /* ... */
}

function enterCredentials() {
  /* ... */
}

function submit() {
  /* ... */
}

/* ... */
```

Заглушки:

```ts
function authorized() {
  /* использует createUserStub */
}

function unauthorized() {
  /* использует create401ErrorStub */
}

// Фабрики POJO относятся к категории заглушек
function createUserStub() {
  /* ... */
}

function create401ErrorStub() {
  /* ... */
}

/* ... */
```

При вопросе разделения декомпозиция истории может выглядеть следующим образом:

```plaintext
productsStories.ts
utils // Локальные компоненты
├── arrangers.ts // Локальная установка окружения
├── setup.ts // Общая установка окружения
├── stubs.ts // Заглушки
└── actors.ts // Взаимодействие с интерфейсом
```

:::tip
Если требуется дополнительное разделение на уровне взятого компонента, можно агрегировать файлы под одноименной папкой:

```plaintext
stubs/
├── createUserStub.ts
├── createRoleStub.ts
└── index.ts // Файл реекспорта
```
:::

## Расположение компонентов

<MetricsTip improves={[Metric.Maintainability]} />

Расположение элементов в историях (и в целом в инфраструктуре `storyshots`) должна быть таковой, чтобы расстояние между
связанными сущностями было как можно меньшим:

**Один файл** - если элемент, например заглушка, используется в одной истории, значит они должны храниться в одном
файле.

:::tip
Если размер файла превышает порог читаемости, то разделению стоит отдать приоритет.
:::

**Общий файл** - если элемент используется в связанных по домену, но разных по файлам историях, значит его нужно
расположить в отдельном файле, который будет располагаться на равном расстоянии между тестами.

Такой файл обычно располагается в уровне ближайшей общей папки:

```plaintext
stories/
├── userStories.ts // Клиент #1
├── producStories/
│   └── removeProductsStories.ts // Клиент #2
├── utils/
│   └── stubs.ts // <-- Общая часть
└── index.ts
```

**Глобальный файл** - если сущность используется в нескольких не связанных между собой историях, то в таком случае она
выносится на самый высокий уровень в `storyshots`.

```plaintext
storyshots/
├── utils/
│   ..... // Глобальные компоненты, используются в не связанных историях.
└── stories/
    ├── userStories.ts
    └── producStories/
        ├── utils // Локальные компоненты
        │   ..... // Используются только в папке producStories
        ├── productRemoveStories.ts
        └── productsStories.ts
```

:::tip
Таким образом, следуя данной методологии можно легко понять насколько ответственным является компонент - чем он выше по
дереву, тем больше у него зависимых клиентов и тем сложнее его будет изменять напрямую.
:::
