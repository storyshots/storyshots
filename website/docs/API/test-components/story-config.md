---
sidebar_position: 2
---

# StoryConfig

Настройки для текущей истории.

---

## device

Устройство, в рамках которого запускается тест.

Пример `desktop` устройства:

```ts
const desktop: Device = {
  name: 'desktop',
  width: 1480,
  height: 920,
};
```

Пример `mobile` устройства:

```ts
const mobile: Device = {
  name: 'mobile',
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
  width: 414,
  height: 896,
};
```

:::tip
Список возможных устройств можно найти [здесь](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json).
:::

## journal

Представляет собой экземпляр [журнала](/specification/requirements/command#способ-верификации).

### record

Записывает вызов метода, сохраняя его имя и аргументы.

```ts
it('...', {
  arrange: (externals, config) => ({
    createUser: (body) => {
      config.journal.record('createUser', body);

      return externals.createUser(body);
    },
  }),
});
```

:::note
Реализация зависит от [клиента preview](/specification/scheme#ipreviewclient). Например, в [`@storyshots/next`](/modules/next) метод является **асинхронным**.
:::

### asRecordable

Оборачивает функцию для логирования её вызовов.

```ts
it('...', {
  arrange: (externals, config) => ({
    createUser: config.journal.asRecordable('createUser', externals.createUser),
  }),
});
```

## previewing

Указывает режим, в котором запущена история.

- `true`: История запущена в режиме [preview](/ui/#превью).
- `false`: История выполняется как тест в фоновом агенте.

:::note
Данное свойство полезно для контроля [внешней среды](/specification/requirements/query). Например, анимации должны быть
активны в режиме предпросмотра (для более наглядной разработки), но быть выключенными в режиме запуска тестов для
исключения недетерминированного поведения.
:::
