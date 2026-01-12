---
sidebar_position: 2
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Externals

Externals - это устоявшийся термин для обозначения объекта управления компонентами: [
*запросы*](/specification/requirements/query) и [*команды*](/specification/requirements/command).

## Тривиальные externals

<MetricsTip improves={[Metric.RegressionProtection, Metric.RefactoringAllowance]} />

Элементы компонентов [*запросы*](/specification/requirements/query) и [*команды*](/specification/requirements/command)
подменяются в `storyshots`.

- _[*Запросы*](/specification/requirements/query)_ - подменяются, чтобы исключить недетерминированность.
- _[*Команды*](/specification/requirements/command)_ - подменяются, чтобы исключить сайд-эффекты.

Это означает, что код оригинальных функций не будет протестирован в историях, ведь он будет заменён методами заглушками.
Поэтому, следует уделить отдельное внимание уровню сложности логики в таких процедурах.

<p style={{ color: 'red' }}>Вместо этого:</p>

```ts
const userRepository: UserRepository = {
  getUser: (id) => {
    return (
      fetch(`/api/user/${id}`)
        /* Обработка #1 */
        .then(parse)
        .then((user) => {
          if (user.isAdmin) {
            /* Обработка #2 */
          }

          /* Обработка #3 */
        })
    );
  },
};
```

<p style={{ color: 'green' }}>Делать это:</p>

```ts
const userRepository: UserRepository = {
  getUser: (id) => fetch(`/api/user/${id}`),
};
```

В первом примере `userRepository.getUser` содержал нетривиальную логику, которая была бы не покрыта тестами из-за
подмены [*запросов*](/specification/requirements/query) заглушками. Для этого, во втором примере подменяемый метод был
сделан _скромным_,
теперь он не содержит особой логики и лишь выполняет простое делегирование серверу.

:::note
Вырезанная логика поднимается выше по стеку, попадая в [тестируемый слой](/specification/scheme#aut).
:::

### Сборка

Важным, и далеко не самым очевидным частным случаем данного правила является порядок сборки приложения.

[Сервер preview](/specification/scheme#ipreviewserver) должен собирать приложение идентичным целевой конфигурации
образом.

<p style={{ color: 'red' }}>Вместо этого:</p>

```ts title="manager.ts"
runUI({
  preview: createFancyPreviewServer({
    /* собственная конфигурация сборки приложения внутри */
  }),
});
```

<p style={{ color: 'green' }}>Делать это:</p>

```ts title="manager.ts"
import { createExecPreview } from '@storyshots/exec-preview';

runUI({
  preview: createExecPreview({
    ui: {
      // Повторно используем стандартные команды для dev окружения
      command: 'npm start',
      at: 'http://localhost:8080',
    },
    // ... //
  }),
});
```

Чем сильнее различается порядок сборки и запуска проекта между `storyshots` и целевым окружением тем меньше защиты от
регресса дают тесты.

## Модульные externals

<MetricsTip improves={[Metric.Maintainability, Metric.Speed]} degrades={[Metric.RefactoringAllowance]} />

Методы, подменяющие [*запросы*](/specification/requirements/query), в том числе и сами заглушки должны быть модульными.
Это в частности означает что
каждая история может подключить только те поведения, что использует внутри.

Представим что в проекте реализован следующий репозиторий:

```ts
type UserRepository = {
  getUser(): Promise<User>;

  setUser(user: User): Promise<void>;

  getRoles(): Promise<string[]>;

  /* И ещё 20+ методов */
};
```

Для того чтобы реализовать подмену, нужно будет определить все методы `UserRepository`:

```ts
const createMockUserRepository = (): UserRepository => {
  return {
    getUser: async () => createUserStub(),
    setUser: async () => {
    },
    getRoles: async () => ['admin', 'user'],
    /* И ещё 20+ методов */
  };
};
```

С учётом размеров репозитория, задача представляется не простой. Проблема не только в размере файла, но и в том факте
что такой большой объект будет связывать между собой несколько разнородных историй, которые в свою очередь далеко не
всегда могут быть связанны общими ответственностями:

```ts
const stories = [
  describe('Roles', [
    it('allows admin to access panel'), // Использует UserRepository.getRoles внутри
  ]),
  describe('UserSettings', [
    it('allows user to change name'), // Использует UserRepository.setUser внутри
  ]),
];
```

Два разных клиента `UserRepository`, в данном случае это `Roles` и `UserSettings`, представляют собой две разные
ответственности. Раз ответственности разные, то и тесты будут изменяться в разное время, но во всех взятых случаях всё
время будет редактироваться одна и та же функция `createMockUserRepository`:

- С одной стороны - она ответственная, это значит что её сложно будет изменять, ведь у неё много зависимых клиентов,
  которые нужно будет постоянно перепроверять.
- С другой, у неё много причин для изменений, ведь как было показано раннее, каждый клиент является катализатором
  изменения.

Это создаёт замкнутый круг где `createMockUserRepository` с каждым разом становится всё больше и сложнее.

Для того чтобы решить данную проблему, достаточно воспользоваться одним из доступных паттернов для расширений, например,
композицией:

```ts
/**
 * По умолчанию реализация либо отстуствует полностью, либо описывает абсолютный минимум методов
 */
const createMockUserRepository = (): UserRepository => {
    return {} as UserRepository;
  };

/**
 * Далee описываются функции которые примешивают поведения репозиторию. Это может быть один или несколько методов.
 */
const withUser = (repository: UserRepository): UserRepository => ({
  ...repository,
  getUser: async () => createUserStub(),
});

/**
 * Функции легко могут быть параметризированы.
 */
const withGivenRoles =
  (roles: string[]) =>
    (repository: UserRepository): UserRepository => ({
      ...repository,
      getRoles: async () => roles,
    });

/**
 * И закреплены за определённым контекстом
 */
const withAdminRoles = withGivenRoles(['admin']);
```

После чего, каждая из историй может установить только те поведения которые считает нужным.

```ts
it('allows admin to access panel', {
  arrange: withAdminRoles, // Необходим только эндпоинт для ролей
});

it('allows user to change name', {
  // Здесь нужны только эти эндпоинты
  arrange: (repository) => withUser(withSetUser(repository)), // <- Можно использовать функцию композиции для чистоты
});
```

:::tip
Команды, например как метод `setUser`, могут и не требовать особой модульности так как являются тривиальными и их
поведение изменяется довольно редко. Их можно реализовывать в функциях моков по умолчанию, либо использовать `Proxy` для
поведения по умолчанию для всех неопределённых методов.
:::

:::warning Важно
Данный метод несколько увеличивает скорость работы так как не устанавливает лишних поведений, но взамен усиливает
связанность историй с деталями реализации.
:::

## Композиция externals

<MetricsTip improves={[Metric.Maintainability]} degrades={[Metric.RegressionProtection]} />

Поведение externals может быть расширено через композицию в функции `arrange`:

```ts
it('allows admin to continue', {
  arrange: (externals) => ({
    ...externals,
    // Добавляем роль администратора
    getUser: async () => {
      const user = await externals.getUser();

      return { ...user, roles: [...user.roles, 'admin'] };
    },
  }),
});
```

:::tip
Композиция - это построение нового поведения на базе уже существующих.
Важной особенностью является то, что такое поведение заключено в _first class_ элемент (например, функцию).
:::

- **Достоинством** данного способа является его минималистичность, ведь изменяются лишь те данные которые требуются во
  взятом сценарии.
- **Недостаток** заключается в наличии зависимости от исходного поведения расширяемого элемента, что увеличивает
  связанность тестов с externals по умолчанию.

## Подмена externals

<MetricsTip degrades={[Metric.Maintainability]} />

Поведение externals может быть расширено через полную подмену в функции `arrange`:

```ts
it('allows admin to continue', {
  arrange: (externals) => ({
    ...externals,
    // Добавляем роль администратора
    getUser: async () => {
      return { ...createUserStub(), roles: [...user.roles, 'admin'] };
    },
  }),
});
```

:::tip
Полная подмена - это полностью самостоятельная реализация метода `externals`. В примере выше, оригинальная реализация
`externals.getUser` полностью игнорируется.
:::

- **Достоинство** заключается в том что тест не зависит от изначального поведения метода.
- **Недостаток** же очевиден - данный метод требует написания большего кол-ва кода.

## Эмуляция externals

<MetricsTip improves={[Metric.RegressionProtection]} degrades={[Metric.Maintainability]} />

`externals` в `storyshots` заключает в себе как методы мутирующие [*команды*](/specification/requirements/command), так
и функции работающие
с [*запросами*](/specification/requirements/query). Очень часто, данные компоненты формируют *пару*:

```ts
function createUserRepository(): UserRepository {
  return {
    // Метод query считывающий список пользователей из БД
    getUsers: async () => [createVasiliyStub(), createIvanStub()],
    // Метод command удаляющий пользователя из БД
    removeUserById: async () => {
    },
  };
}
```

:::note
Метод `removeUserById` относится к компоненту [*запросы*](/specification/requirements/query).
:::

В большинстве случаев рекомендуется просто фиксировать вызов `removeUserById` в журнале, делая при этом его
реализацию тривиальной:

```ts
it('removes user from a list', {
  arrange: (externals, { journal }) => ({
    ...externals,
    removeUserById: journal.asRecordable(
      'removeUserById',
      externals.removeUserById,
    ),
  }),
  // Удаляем пользователя в списке по имени
  act: (actor) => actor.click(finder.get(removeActionByName('Ivan'))),
});
```

:::note
Таким образом, поведение будет верифицировано косвенным образом, через слепок взаимодействия с сервером под видом
журнала вызовов.
:::

Однако, этого не всегда бывает достаточно. Что если мы хотим убедиться в том что список обновился и теперь не отображает
удалённого пользователя? Для этого можно воспользоваться эмуляцией:

```ts
it('removes user from a list', {
  arrange: (externals) => {
    // Локальное состояние. В данном случае это список пользователей
    let users = [createVasiliyStub(), createIvanStub()];

    return {
      ...externals,
      getUsers: async () => users,
      // Удаляем пользователя из списка
      removeUserById: async (id) => (users = without(users, { id })),
    };
  },
  // Удаляем пользователя в списке по имени
  act: (actor) => actor.click(finder.get(removeActionByName('Ivan'))),
});
```

Несмотря на то что эмуляция поведения может увеличить покрытие теста, её стоит использовать как можно реже. Это связанно
с сильным ухудшением поддерживаемости:

- Это дублирование поведение сервера.
- Это дополнительная логика в тестах, а значит и пространство для потенциальных дефектов в них.

:::tip
Эмуляция выгодна в том случае если поведение является тривиальным на сервере, но в то же самое время комплексным на
клиенте.
:::

:::warning Важно
Тесты являются кодом который сам по себе не **тестируется**. Поэтому так важно следить за их чистотой и простотой.
:::

:::tip
Эмуляцию можно упростить используя [`iterated`](/modules/arrangers#iterated) метод.
:::

## Оптимизация arrange

На проектах структура `externals` ([*запросы*](/specification/requirements/query) и [
*команды*](/specification/requirements/command)) очень часто является вложенной:

```ts
type Externals = {
  repositories: {
    userRepository: UserRepository;
    /* ... */
  };
  /* ... */
};
```

Это делает нетривиальным процесс её обновления. Для того чтобы исправить данную проблему достаточно использовать
композируемые фабрики:

<p style={{ color: 'red' }}>Вместо этого:</p>

```ts
it('...', {
  arrange: (externals) => ({
    // Вложенность высокая из-за чего читаемость сильно страдает
    ...externals,
    repositories: {
      ...externals.repositories,
      UserRepository: {
        ...externals.repositories.UserRepository,
        getUser: (data) =>
          externals.repositories.UserRepository.getUser(data).then((user) => ({
            ...user,
            login: 'test-user',
          })),
      },
    },
  }),
});
```

<p style={{ color: 'green' }}>Делать это:</p>

```ts
import { createArrangers } from '@storyshots/arrangers';

const { transform } = createArrangers<Externals>().focus('repositories');

it('...', {
  // Код делает тоже самое, но читается лучше
  arrange: transform('UserRepository.getUser', (user) => ({
    ...user,
    login: 'test-user',
  })),
});
```

:::note
Для того чтобы узнать больше рекомендуется ознакомится с [`@storyshots/arrangers`](/modules/arrangers)
:::

:::tip
Данный паттерн особенно хорошо работает в связке с [модульной внешней средой](/patterns/externals#модульные-externals).
:::

:::warning внимание
Состояние историй **автоматически изолируется**, поэтому, строго говоря, `externals` можно мутировать напрямую:

```ts
it('...', {
  arrange: (externals) => {
    externals.repositories.UserRepository.getUser = (data) =>
      externals.repositories.UserRepository.getUser(data).then((user) => ({
        ...user,
        login: 'test-user',
      }))
  },
});
```

Однако, это не рекомендуется делать в общем случае, так как прямые мутации негативно сказываются на композиционных свойствах функции.
:::
