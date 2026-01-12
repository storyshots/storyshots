---
sidebar_position: 4
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Подмена поведений

`storyshots` требует подмены компонентов: [*запросы*](/specification/requirements/query) и [*команды*](/specification/requirements/command) на функции заглушки,
для того чтобы сделать эталонное тестирование возможным.

## Подмена через инверсию

<MetricsTip improves={[Metric.Maintainability]} degrades={[Metric.RefactoringAllowance]} />

Инверсия зависимостей является одним из способов подмены поведений.

Рассмотрим следующий пример:

```ts
async function placeAnOrder(order: OrderRepository) {
  showLoading('Создание заказа');

  await order.createOrder();

  hideLoading();

  showMessage('Заказ был успешно создан');
}
```

Функция `placeAnOrder` принимает в качестве аргумента любое значение, реализующее интерфейс `OrderRepository`.

В реальном коде в функцию `placeAnOrder` передается репозиторий выполняющий обращения к серверу:

```ts
placeAnOrder(orderRepository);
```

В окружении `storyshots` ту же функцию можно использовать с заглушками:

```ts
placeAnOrder(mockOrderRepository);
```

:::note
Поведение `placeAnOrder` изменится, однако исходный код самой функции будет идентичным. Это и называется _расширением_.
:::

### Инверсия зависимостей

С помощью интерфейса `OrderRepository` зависимость между `placeAnOrder` и `orderRepository` была инвертирована.
Репозиторий удалось подменить только потому, что `placeAnOrder` теперь не зависит от `orderRepository` напрямую.

В то же время, если реализация `placeAnOrder` изменится:

```ts
async function placeAnOrder(order: OrderRepository) {
  showLoading('Создание заказа');

  await order.createOrder();
  // Добавился новый метод
  await order.scheduleDelivery();

  hideLoading();

  showMessage('Заказ был успешно создан');
}
```

То `orderRepository` придётся измениться, чтобы удовлетворять новому интерфейсу.

:::note
Интерфейсы являются частью своих клиентов, так как именно пользователи (клиенты) диктуют требования
системам (интерфейсам), которыми пользуются.
:::

### Инверсия в React

Инверсия зависимостей зачастую сопровождается механизмами внедрение зависимостей (dependency injection). DI
можно разделить на две стадии:

- Создание зависимостей
- Внедрение зависимостей

React предоставляет свой аналог DI, так называемый контекст, где `Provider` является компонентом устанавливающим
зависимости, а `Consumer` позволяет их считывать, сквозь дерево компонентов.

:::note
С одной стороны это позволяет уменьшить связанность компонентов и повышает их гибкость. С другой - уменьшает возможности
для статической типизации.
:::

В таком случае можно создать корневой провайдер определяющий подменяемые зависимости:

```tsx
type Externals = {
  repositories: {
    /* методы обращения к серверу */
  };
  env: {
    /* методы работы с Web API */
  };
  /* и другие */
};

const Context = createContext<Externals | undefined>();

export const Externals: React.FC<
  React.PropsWithChildren<{ externals: Externals }>
> = ({ externals, children }) => {
  return <Context.Provider externals={externals}>{children}</Context.Provider>;
};

export const useExternals = () => {
  const externals = useContext(Context);

  if (externals === undefined) {
    throw new Error('Externals dependency is missing');
  }

  return externals;
};
```

Далее объявить фабрики для реального и тестового окружений:

```ts
declare function createExternals(): Externals;

declare function createMockExternals(): Externals;
```

:::tip
Тестовый код желательно отделять от реального окружения (см. [Дислокация тестов](/patterns/files#дислокация-тестов)).
:::

Точка входа в реальное окружение может выглядеть так:

```tsx
export const Main: React.FC = () => (
  // В реальном окружении используются реальные externals.
  <Externals externals={createExternals()}>
    <App />
  </Externals>
);
```

В тестах `externals` подменяются на тестовые данные:

```ts title="preview.ts"
export const { run, it } = createPreviewApp({
  createExternals: createMockExternals,
  createJournalExternals: createJournalExternals,
});
```

```tsx title="run.tsx"
run(
  map(stories, (story) => ({
    render: (externals) => (
      // В окружении storyshots внедряются тестовые зависимости
      <Externals externals={externals}>
        <App />
      </Externals>
    ),
    ...story,
  })),
);
```

### Оценка

Достоинства данного метода:

- **Строгость** - инвертируемые зависимости нельзя использовать до того, как они будут созданы. Это очевидное свойство
  дополнительно контролируется компилятором.
- **Безопасность** - данный метод идеально совмещается с TypeScript и обеспечивает максимальную корректность на
  статическом уровне.
- **Влиятельность** - с помощью данного метода подмены, тесты оказывают дополнительное влияние на архитектуру
  приложения, делая её более расширяемой и адаптивной к изменениям.

Недостатки:

- **Многословность** - инверсия требует создание новой промежуточной сущности, интерфейса.
- **Требовательность** - код должен быть структурирован таким образом, чтобы поддерживать инверсию. Библиотеки, даже
  самые популярные, далеко не всегда позволяют расширять свои поведения данным образом.
- **Зависимость** - данный метод подмены сильнее связывает тесты с внутренним устройством кода проекта, усложняя
  рефакторинг.

:::tip
Данный метод подмены рекомендуется для новых проектов с небольшой кодовой базой и пока ещё податливой внутренней
структурой.
:::

## Подмена через сайд-эффекты

<MetricsTip improves={[Metric.RefactoringAllowance]} degrades={[Metric.Maintainability]} />

Помимо явной подмены через инверсию, также можно заменять зависимости путём их явного модифицирования.

Рассмотрим пример:

```ts
const orderRepository = {
  // Обращение к серверу
  createOrder: () => fetch('...'),
};

async function placeAnOrder() {
  showLoading('Создание заказа');

  await orderRepository.createOrder();

  hideLoading();

  showMessage('Заказ был успешно создан');
}
```

`placeAnOrder` использует `orderRepository`. Для того чтобы протестировать функцию, можно подменить поведение
репозитория напрямую:

```ts
// Подменяем метод `createOrder` на заглушку на прямую.
orderRepository.createOrder = () => {
  /* ... */
};

placeAnOrder();
```

:::note
В `storyshots`, все истории существуют в изолированных друг от друга окружениях, поэтому влияние подобного рода подмены
на другие тесты исключается.
:::

### Monkey-patching в React

При данном типе подмены, рекомендуется использовать репозитории как глобальные singleton объекты:

```ts title="repositories.ts"
export const orderRepository = {
  /* ... */
};

export const userRepository = {
  /* ... */
};

export const productRepository = {
  /* ... */
};

/* И другие репозитории */
```

В конкретном компоненте, репозитории используются напрямую, по ссылке:

```ts
export const UserPage: React.FC = () => {
  const response = useQuery(userRepository.getUser);

  /* ... */
};
```

В тестах, следует объявить фабрику заглушек на основе глобальных репозиториев:

```ts
// Реестр используемых в приложении репозиторев
const registry = {
  orderRepository,
  userRepository,
  productRepository,
};

// Фабрика по созданию заглушек для каждого из репозиториев
declare function createMockRepositories(): typeof registry;
```

:::tip
Реестр репозиториев можно объявить сразу, на уровне реального кода, в таком случае в тестах его создавать не придется,
что уменьшит связанность.
:::

Далее объявить компонент, который будет осуществлять внедрение описанных зависимостей:

```ts
type Props = React.PropsWithChildren<{ repositories: typeof registry }>;

const RepositoryReplacer: React.FC<Props> = ({ repositories, children }) => {
  useMemo(() => {
    /**
     * *Опционально* можно помечать не замоканные методы как не реализованные по умолчанию.
     * Это упростит отладку и исключит нежелательные сайд-эффекты.
     */
    markAllAsNotImplemented();

    injectImplementations(repositories);
  }, []);

  return children;
};

function markAllAsNotImplemented() {
  forEveryMethod(registry).forEach(
    (repository, method) => (registry[repository][method] = notImplemented),
  );
}

function injectImplementations(overrides: Props['repositories']) {
  forEveryMethod(overrides).forEach(
    (repository, method, impl) => (registry[repository][method] = impl),
  );
}
```

Интеграция `storyshots`:

```ts title="preview.ts"
export const { run, it } = createPreviewApp({
  createExternals: createMockExternals,
  createJournalExternals: createJournalExternals,
});
```

```tsx title="run.tsx"
run(
  map(stories, (story) => ({
    render: (repositories) => (
      // В окружении storyshots внедряются тестовые зависимости
      <RepositoryReplacer repositories={repositories}>
        <App />
      </RepositoryReplacer>
    ),
    ...story,
  })),
);
```

:::warning Внимание
Зависимости подменяются не сразу, а на этапе выполнение `render` функции `RepositoryReplacer`. Это означает, что если
подменяемые функции используются до этого, например на этапе загрузки модуля, то их реализация останется оригинальной:

```ts title="index.ts"
// getVersion не будет подменён так выполнится раньше чем сработает подмена в RepositoryReplacer.
const version = manifestRepository.getVersion();

export const App = () => {
  /* ... */
};
```

Зависимости можно подменять и раньше, но тогда для них не будет работать функция `arrange`.
:::

### Оценка

Достоинства:

- **Компактность** - метод не требует создания большого числа дополнительных сущностей.
- **Независимость** - за счёт своей не явности, такой способ подмены идеально подходит для использования в legacy
  стемах.
- **Глобальность** - с помощью данного вида подмены, можно заменять поведения даже там, где это не предусматривалось
  изначальное - например в сторонних библиотеках.

Недостатки:

- **Не строгость** - нет никакой гарантии что подменяются все зависимости, что используются в приложении.
- **Не безопасность** - корректность сайд-эффектов нельзя в полной мере проверить с помощью статических типов.

:::tip
Подмены через инверсию и сайд-эффекты можно комбинировать:

- Репозитории можно подменять методом инверсии, так как они являются частью приложения и находятся под полным контролем
  разработчиков
- Web-API следует заменять через сайд-эффекты, так как он является глобальным и общедоступным. Библиотека
  [`@storyshots/web-api-mocks`](/modules/web-api) как раз это и выполняет.
  :::
