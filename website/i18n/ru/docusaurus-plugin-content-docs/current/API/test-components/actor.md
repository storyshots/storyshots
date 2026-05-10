---
sidebar_position: 1
---

# actor {#actor}

Актор представляет собой [пользователя](/specification/requirements/user). Осуществляет взаимодействие с приложением эмулируя действия на странице.

---

## hover {#hover}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-hover)

## click {#click}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-click)

## dblclick {#dblclick}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-dblclick)

## fill {#fill}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-fill)

## wait {#wait}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-frame#frame-wait-for-timeout)

:::warning Внимание
Данный метод предназначен исключительно для отладки.
:::

## scrollTo {#scrollto}

Использует оригинальный метод
[`playwright`](https://playwright.dev/docs/api/class-locator#locator-scroll-into-view-if-needed)

## select {#select}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-select-option)

## keyboard {#keyboard}

### press {#press}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-keyboard#keyboard-press)

### down {#down}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-keyboard#keyboard-down)

### up {#up}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-keyboard#keyboard-up)

## mouse {#mouse}

### move {#move}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-mouse#mouse-move)

### down {#down}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-mouse#mouse-down)

### up {#up}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-mouse#mouse-up)

### wheel {#wheel}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-mouse#mouse-wheel)

## clear {#clear}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-clear)

## highlight {#highlight}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-highlight)

:::warning Внимание
Данный метод предназначен исключительно для отладки.
:::

## drag {#drag}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-drag-to)

## blur {#blur}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-blur)

## pressSequentially {#presssequentially}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-press-sequentially)

## waitFor {#waitfor}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-wait-for)

## waitForURL {#waitforurl}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-page#page-wait-for-url)

## resize {#resize}

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

## screenshot {#screenshot}

Осуществляет промежуточные снимки во время действий на странице.

:::note
Если вызывается последним в цепочке - переопределяет параметры последнего снимка создаваемого по умолчанию.
:::

:::warning Внимание
Имя снимка должно быть в формате PascalCase. Также допускаются символы `_`.
:::

```ts
actor
  // Сделать снимок начального состояния формы
  .screenshot('Initial')
  .do(fillForm())
  // Назвать конечный снимок как Filled
  .screenshot('Filled');
```

### Маскирование {#masking}

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

## uploadFile {#uploadfile}

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

## do {#do}

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

## toMeta {#tometa}

Преобразует действия актора в мета-объекты, используемые `storyshots`.

:::note
Если итоговый массив пустой, тест считается пустым и не запускается тест-раннером.
:::

## stop {#stop}

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

## exec {#exec}

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
