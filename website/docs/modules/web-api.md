---
sidebar_position: 4
---

# @storyshots/web-api-externals

Подменяет `WebAPI` на их [тестируемые аналоги](/specification/requirements/env)
через [инвазивный метод](/patterns/replace#подмена-через-сайд-эффекты).

## install

Подменяет недетерминированный браузерный API. Возвращает [Clock](/modules/web-api#clock).

```ts
import { install } from '@storyshots/web-api-externals';

// Замораживает время на странице на отметке 13.01.2024 12:00
export const clock = install({ now: new Date(2024, 0, 13, 12) });
```

:::warning Внимание
Для корректной работы должна вызываться до выполнения любого другого кода на странице.
:::

## clock

Объёкт управления временем.

Работает по следующим правилам:

* Дата остаётся фиксированной и не изменяется с течением времени.
* Таймеры (`setTimeout`, `setInterval`) на странице выполняются в обычном режиме.

:::tip
`clock` доступен в глобальном объекте `window`, что делает доступным его использование в [`exec`](/API/story-elements/actor#exec).
:::

### tick

Проматывает время вперёд на указанное кол-во ms.

Рассмотрим поведение:

```ts
// Уведомление закрывается через 5 секунд
setTimeout(() => closeNotification(), 5_000);
```

Для того чтобы не ждать в истории так долго, можно воспользоваться специальным методом `tick`:

```ts
it('closes notification', {
    act: (actor) => actor
        .screenshot('NotificationShown')
        // Перемотать на 5 секунд вперёд
        .exec(() => window.clock.tick(5_000))
        .screenshot('NotificationHidden')
});
```

:::note
Метод влияет только на таймеры, текущая дата остаётся не тронутой. См. [unfreeze](/modules/web-api#unfreeze)
:::

### setSystemTime

Устанавливает текущую дату:

```ts
it('...', {
    arrange: (externals) => {
        // Для данной истории дата будет установлена как 13.01.2024
        clock.setSystemTime(new Date(2024, 0, 13));

        return externals;
    },
});
```

:::note
Метод влияет только на текущую дату, таймеры не пересчитываются.
:::

### unfreeze

Размораживает текущую дату:

```ts
it('...', {
    arrange: (externals) => {
        // Для данной истории дата будет изменяться с течением времени 
        clock.unfreeze();

        return externals;
    },
});
```

:::warning Внимание
Функция `unfreeze` по сути возвращает естественное течение времени на страницу, частично отменяя действия
`@storyshots/web-api-externals`.

Полезен крайне редко, например при использовании [`debounce`](https://lodash.com/docs/4.17.15#debounce).
В остальном, не рекомендуется к применению. 
:::

## Состояние

`@storyshots/web-api-externals` также подменяет локальные хранилища на те, что хранят свои данные во временной памяти.

```ts
// Данная запись будет автоматически стёрта при запуске новой истории
localStorage.setItem('token', '...');
```

:::note
`IndexedDB` не заменяется данным модулем.
:::