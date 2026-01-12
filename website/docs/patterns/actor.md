---
sidebar_position: 3
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Актор

Описание актора - это важная сторона историй в `storyshots`. При правильном подходе, можно значительным образом
упросить тесты и рефакторинг на проекте.

## Семантические селекторы

<MetricsTip improves={[Metric.RefactoringAllowance, Metric.Maintainability]} />

Вторым узким местом после заглушек является функция `act`. Описывая инструкции взаимодействия с интерфейсом можно легко
увеличить связанность историй с деталями реализации программы, сделав тесты при этом более хрупкими:

<p style={{ color: 'red' }}>Вместо этого:</p>

```tsx
it('allows to delete product', {
  act: (actor) =>
    actor.click(
      finder.locator('div.user-card div.button').getByText('Удалить'),
    ),
});
```

Тест в данном случае "знает" о внутренней структуре `DOM`.

<p style={{ color: 'green' }}>Делать это:</p>

```tsx
it('allows to delete product', {
  act: (actor) => actor.click(finder.getByRole('button', { name: 'Удалить' })),
});
```

Семантическая маркировка интерфейса помогает инкапсулировать детали реализации интерфейса от историй.

:::note
Исключение составляют компоненты из сторонних библиотек, которые не всегда поддаются достаточному расширению.
:::

Рекомендуется предпочитать селекторы, оперирующие видимыми пользователем атрибутами. В основном это отображаемый
текст и роли.

## data-testid селекторы

Существуют методики, которые предполагают несколько иной подход к абстракции, а именно использование специальных
тестовых индикаторов:

```tsx
<button data-testid="delete-user-button">Удалить</button>
```

```tsx
it('allows to delete product', {
  act: (actor) => actor.click(finder.getByTestId('delete-user-button')),
});
```

### Достоинства

К достоинствам данного подхода можно отнести тот факт, что истории ещё сильнее абстрагируются от конкретных деталей
реализации интерфейса. И даже от части его _наблюдаемого поведения_.

:::tip
Проще всего это понять на примере:

`getByRole('button', { name: 'Удалить' })` напрямую завязан на текст кнопки. Если он изменится, то селектор
нужно будет корректировать вручную. То же самое можно сказать и про роль.

`data-testid` не чувствителен к подобному роду изменений и селектор останется прежним. Тем самым, делая тест более
устойчивым к изменениям тестируемого приложения.
:::

Также, за счёт своей управляемости, data-testid позволяет проще использовать техники TDD. Все идентификаторы и
взаимодействия можно продумать и прописать заранее, до разработки самого интерфейса страницы:

```typescript
it('allows to delete multiple products', {
  act: (actor) =>
    actor
      .click(finder.getByTestId('product-0-checkbox'))
      .click(finder.getByTestId('product-1-checkbox'))
      .click(finder.getByTestId('delete-selected-button'))
      .click(finder.getByTestId('confirm-delete-button')),
});
```

:::note
Сложно предугадать семантику элементов на странице, до их непосредственного появления. С data-testid всё проще, т. к. их
содержание и значение определяется самим разработчиком, а не системой.
:::

:::tip
data-testid также может использоваться сторонними командами, например инженерами по авто-тестам.
:::

### Недостатки

Можно отметить следующие недостатки:

- Данная техника, хоть и делает тесты более устойчивыми, но при неосторожном использовании может снижать защиту от
  регресса, т. к. уходит часть верификаций семантической стороны интерфейса.
- data-testid засоряет основной код приложения и требует дополнительного времени разработчика.
- В среднем тесты с data-testid читать сложнее чем аналогичные сценарии с семантическими селекторами.

## Компонентный подход

<MetricsTip improves={[Metric.Maintainability]} />

Любой UI интерфейс можно разбить на компоненты.

:::tip
Компонент - это элемент страницы реализующий в себе представление, поведение и модель взаимодействия.
:::

Такие элементы являются особенно полезными в контексте программирования, ведь их можно повторно использовать на разных
страницах, не повышая при этом сложность проекта. `storyshots` дополнительно эксплуатирует данный факт предоставляя
методы расширения для [`actor`](/API/test-components/actor) и [`finder`](/API/test-components/finder):

<p style={{ color: 'red' }}>Вместо этого:</p>

```tsx
const stories = [
  it('allows to delete user', {
    /**
     * В UserPage используется обычная кнопка удаления <button>Удалить</button>
     */
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Удалить' })),
    render: () => <UserPage />,
  }),
  it('allows to delete product', {
    /**
     * В ProductsPage используется та же кнопка, но разработчики реализовали её иначе,
     * по какой-то причине: <div className="button">Удалить</div>
     */
    act: (actor) =>
      actor.click(finder.locator('div.button').getByText('Удалить')),
    render: () => <ProductsPage />,
  }),
];
```

Из-за того что одинаковые для пользователя элементы реализованы по-разному, сами инструкции взаимодействия в историях
также отличаются.

<p style={{ color: 'green' }}>Делать это:</p>

```tsx
/**
 * За счёт использования компонентного подхода, селекторы между тестами также могут быть унифицированы
 */
const button =
  (name: string): FinderTransformer =>
  (finder) =>
    finder.getByRole('button', { name });

const stories = [
  it('allows to delete user', {
    act: (actor) => actor.click(finder.get(button('Удалить'))),
    render: () => <UserPage />,
  }),
  it('allows to delete product', {
    act: (actor) => actor.click(finder.get(button('Удалить'))),
    render: () => <ProductsPage />,
  }),
];
```

Можно пойти дальше и реализовать отдельный объект с селекторами, основываясь на компонентной системе используемой в
приложении:

```ts title="selectors.ts"
declare const button: FinderTransformer;

declare const modal: FinderTransformer;

/* и другие */
```

Расширять можно не только сами селекторы, но и целые действия:

```ts title="actions.ts"
declare const upload: ActorTransformer;

declare const dismiss: ActorTransformer;

/* и другие */
```

При следовании компонентному подходу и использовании методов расширения, можно существенным образом упростить истории:

```ts
it('allows to remove a user from list', {
  act: (actor) =>
    actor.do(trash('Vasiliy')).screenshot('ConfirmationWindow').do(confirm()),
});
```
