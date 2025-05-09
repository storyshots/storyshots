---
sidebar_position: 1
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Истории

История это базовый элемент `storyshots`. Он фиксирует приложение в его определённом состоянии, описывая параметры
внешнего окружения и действия пользователя.

## Разделение историй

<MetricsTip improves={[Metric.Maintainability, Metric.Speed]} />

`storyshots` реализует множество инструментов направленных на разделение тестовых сценариев. Один из них - это
использование семантических групп `describe`.

Большое кол-во сценариев, объеденённых вместе не только увеличивают размер файла, но и усложняют свою поддержку ввиду
разности их ответсвенностей.

:::note
Ответственность - это причина по которой код может быть измененён. Если две разные функции меняются в одно и тоже время,
по одной и той же причине, то в таком случае их отвественности считаются равными.
:::

<p style={{ color: 'red' }}>Вместо этого:</p>

```ts
const stories = [
    it('shows list of products', /* ... */),
    it('allows to add a product', /* ... */),
    it('rejects unauthorized access to a store', /* ... */),
];
```

<p style={{ color: 'green' }}>Делать это:</p>

```ts
const stories = [
    describe('Products', [
        it('shows list of products', /* ... */),
        it('allows to add a product', /* ... */),
    ]),
    describe('Auth', [
        it('rejects unauthorized access to a store', /* ... */),
    ]),
];
```

:::tip
Истории должны быть декомпозированы таким образом, чтобы при их последующем редактировании (или чтении) в них было как
можно меньше избыточных элементов.
:::

[//]: # (TODO: Move from here START)

:::warning Внимание
Текст в блоках `describe` и `it` являются основанием имён файлов и папок, поэтому должны иметь совместимое содержание, а
именно: латиница без специальных символов внутри.
:::

* `describe` блоки - это чаще всего наименование домена, подфункции или отвественности. Рекомендуется именовать коротким
  словосочетанием в CamelCase (с заглавной буквы).
* `it` блоки - это конкретная история, читается как - "Это приложение (it) текст истории".

:::tip

```ts
it('allows for user to logout');
```

Читается как - "Это приложение позволяет пользователью выйти из учётной записи".
:::

[//]: # (TODO: Move from here END)

## Слияние историй

<MetricsTip improves={[Metric.Speed]} degrades={[Metric.Maintainability]} />

`storyshots` позволяет в рамках одной истории сделать не один снимок экрана, а сразу несколько:

<p style={{ color: 'red' }}>Вместо этого:</p>

```ts
const stories = [
    it('shows disabled password initially'), // Тест просто делает снимок изначального состояния страницы
    it('allows to enter password after login filled', { // Проверяет активность пароля после ввода
        act: (actor) => actor.fill(finder.getByPlaceholder('Login'), 'Логин'),
    }),
    it('allows to enter credentials', { // Проверяет возможность заполнения формы
        act: (actor) => actor
            .fill(finder.getByPlaceholder('Login'), 'Логин')
            .fill(finder.getByPlaceholder('Password'), '1235'),
    })
];
```

<p style={{ color: 'green' }}>Делать это:</p>

```ts
const stories = [
    it('allows to enter credentials', { // История проверяет все состояния сразу
        act: (actor) => actor
            .screenshot('Initial')
            .fill(finder.getByPlaceholder('Login'), 'Логин')
            .screenshot('PasswordEnabled')
            .fill(finder.getByPlaceholder('Password'), '1235'),
    })
];
```

Изначально, существовало 3 разных истории каждая из которых проверяла отдельное состояние формы. Благодаря
промежуточным снимкам, удалось сократить общее количество тестов и следовательно снизить общее время их выполнения. При
этом, показатель защиты от регресса не постардал.

:::note
Вопрос декомпозиции тестов является достаточно комплексным:

* С одной стороны, тестов должно быть как можно меньше, ведь в противном случае растет кол-во кода, увеличивается время
  выполнения и сами проверки также могут дублировать части друг друга.
* С другой стороны, чем больше тест, тем сложнее контролировать уровень покрытия сценариев работы приложения, к тому же
  растёт риск смешивания ответственностей с которым борется пункт [декомпозиция историй](/patterns/stories#разделение-историй).

Другими словами, дело в *балансе*.

Общая рекомендация - начинать с самого простого, в большинстве случаев это написание одной крупной истории. Далее, при
возникновении проблем с поддержкой её следует разбивать на более атомарные и независимые элементы.
:::

## Приоритеты историй

<MetricsTip improves={[Metric.Maintainability, Metric.Speed]} degrades={[Metric.RegressionProtection]} />

Со временем количество историй в проекте будет расти, вместе с этим будет увеличиваться и время их выполнения. Для того
чтобы смягчить влияние данной проблемы, можно добавить дополнительные атрибуты истории:


```ts title="extend-module.ts"
declare module '@storyshots/core' {
  interface StoryAttributes<TExternals> {
    // Можно использовать любые структуры, даже функции.
    secondary?: true;
  }
}
```

После, разметить тесты по приоритетам:

```ts
const stories = [
    // Важно чтобы в приложении работал вход 
    it('allows to login'),
    // При этом, выбор темы относится к второстепенным сценариям 
    it('allows to set dark theme', {
      secondary: true,
    }),
];
```

Далее, установить отдельный режим при котором будут запускаться только важные истории:

```ts
run(filter(stories, (story) => not(story.secondary)));
```

:::tip
При использовании данного паттерна, рекомендуется по умолчанию устанавливать либо низкий, либо высокий
приоритет у историй.
:::

## Универсальный render

<MetricsTip improves={[Metric.Maintainability]} />

`storyshots` предоставляет возможность описывать функцию `render` у каждой истории по отдельности, что может подойти для
тестирования UI библиотеки:

```tsx
const renders = it;

const buttonStories = [
    renders('primary button', {
        render: () => <Button type="primary" />,
    }),
    renders('primary disabled button', {
        render: () => <Button type="primary" disabled />,
    }),
];
```

Однако, для тестирования конечного приложения данный вариант является мало практичным. Вместо этого рекомендуется описывать
`render` по умолчанию:

```tsx title="preview.tsx"
export const { run, it } = createPreviewApp(/* ... */);
```

```tsx title="index.tsx"
run(
    map(stories, (story) => ({
            // По умолчанию будет отрисовываться корневой компонент приложения 
            render: (externals) => <App externals={externals} />,
            ...story,
        })
    )
);
```

```tsx title="stories.tsx"
export const stories = [
    it('...', {
        /**
         * Описывать render в истории не обязательно.
         */
    }),
];
```
