---
sidebar_position: 1
---

# actor

Актор представляет собой [пользователя](/specification/requirements/user). Осуществляет взаимодействие с приложением эмулируя действия на странице.

---

## hover

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-hover)

## click

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-click)

## dblclick

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-dblclick)

## fill

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-fill)

## wait

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-frame#frame-wait-for-timeout)

:::warning Внимание
Данный метод предназначен исключительно для отладки.
:::

## scrollTo

Использует оригинальный метод
[`playwright`](https://playwright.dev/docs/api/class-locator#locator-scroll-into-view-if-needed)

## select

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-select-option)

## keyboard

### press

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-keyboard#keyboard-press)

### down

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-keyboard#keyboard-down)

### up

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-keyboard#keyboard-up)

## mouse

### move

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-mouse#mouse-move)

### down

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-mouse#mouse-down)

### up

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-mouse#mouse-up)

### wheel

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-mouse#mouse-wheel)

## clear

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-clear)

## highlight

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-highlight)

:::warning Внимание
Данный метод предназначен исключительно для отладки.
:::

## drag

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-drag-to)

## blur

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-blur)

## pressSequentially

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-press-sequentially)

## waitFor

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-wait-for)

## waitForURL

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-page#page-wait-for-url)

## resize

Изменяет viewport браузера в соответствии с конфигурацией:

```ts
actor.resize({ width: 1440, height: 920 });
```

:::tip
`resize` также влияет и на размер снимка экрана. Рекомендуется использовать данный метод для съёмки длинных форм и
списков.
:::

:::note
Размер сохраняется для всех последующих действий и может быть переопределён последующим `resize`.
:::

## screenshot

Осуществляет промежуточные снимки во время действий на странице.

:::note
Если вызывается последним в цепочке - переопределяет параметры последнего снимка создаваемого по умолчанию.
:::

:::warning Внимание
Наименование снимка должно содержать только латинские символы, так как оно используется в качестве наименований файлов в
эталоне. Использование специальных символов также запрещено.
:::

```ts
actor
  // Сделать снимок начального состояния формы
  .screenshot('Initial')
  .do(fillForm())
  // Назвать конечный снимок как Filled
  .screenshot('Filled');
```

### Маскирование

На снимках можно маскировать элементы, это может быть полезно при работе с динамически изменяемыми данными:

```ts
actor
  .do(fillForm())
  // Маскируем компонент отображающий время
  .screenshot('Filled', { mask: [finder.get(appClock())] });
```

:::warning Внимание
Данное свойство рекомендуется применять как можно реже, так как оно снижает защиту от регресса. Следует отдавать
предпочтение [иным методам](/patterns/replace) подмены [внешней среды](/specification/requirements/query).
:::

## uploadFile

Загружает один или несколько файлов в целевой элемент:

```ts
actor.uploadFile(finder.get(uploadTrigger()), 'path/to/file_0.ext');
```

:::note
Первым аргументом `uploadFile` принимает элемент, по клику на который открывается проводник файлов для загрузки.
:::

:::tip
Путь к файлам считается относительно рабочей директории проекта. Поэтому рекомендуется для простоты располагать их в
одном месте:

```ts
function getPath(file: string) {
  return `/src/storyshots/externals/files/${file}`;
}

actor.uploadFile(finder.get(uploadTrigger()), [
  getPath('file_1.ext'),
  getPath('file_2.ext'),
]);
```

:::

## do

Позволяет расширять действия пользователя используя специальные трансформеры:

```ts
function enterCredentials(): ActorTransformer {
  return (actor) =>
    actor
      .fill(finder.getByRole('username'), 'user')
      .fill(finer.getByRole('password'), 'pass');
}

actor.do(enterCredentials());
```

Функция также принимает [окружение истории](/API/test-components/story-config) как второй аргумент:

```ts
function closePopup(): ActorTransformer {
  return (actor, config) =>
    config.device.name === 'mobile'
      ? actor.do(swipe())
      : actor.click(finder.get(cross()));
}
```

## stop

Останавливает выполнение всех последующих действий:

```ts
actor
  .hover() // Выполнится
  .stop() // После данной точки, все последующие действия не будут выполнены
  .click()
  .fill();
```

:::warning Внимание
Данный метод предназначен исключительно для отладки.
:::

## exec

Вызывает переданную функцию в контексте страницы.

```ts
actor
  .do(submit())
  // Будет выполнен сразу после submit
  .exec(() => window.alert('Code has been injected'));
```

:::warning Внимание
Функции, передаваемые в `exec` не могут иметь [внешних зависимостей](/specification/requirements/query) за исключением
глобальных объектов `Browser API`.
:::
