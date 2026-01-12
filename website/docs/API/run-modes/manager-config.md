---
sidebar_position: 3
---

# ManagerConfig

Конфигурация для менеджера `storyshots`. Используется при запуске в режимах [UI](/API/run-modes/runUI) и [CI](/API/run-modes/runCI).

---

## devices

Описывает список [устройств](/API/test-components/story-config#device), в рамках которых запускаются истории.

:::note
Первый объект в списке `devices` становится [устройством по умолчанию](/ui/#запуск).
:::

```ts
export default {
  devices: [
    {
      name: 'desktop',
      width: 1480,
      height: 920,
    },
    {
      name: 'mobile',
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
      width: 414,
      height: 896,
    },
  ],
  /* ... */
};
```

## preview

Принимает [сервер preview](/specification/scheme#ipreviewserver).

```ts
import { createExecPreview } from '@storyshots/exec-preview';

export default {
  preview: createExecPreview(/* конфигурация */),
  /* ... */
};
```

## paths

Содержит описание путей для артефактов `storyshots`.

```ts
export default {
  paths: {
    // Путь до папки с журналами
    records: path.join(process.cwd(), 'records'),
    // Путь до папки со снимками экрана
    screenshots: path.join(process.cwd(), 'screenshots')
  },
  /* ... */
};
```

## runner

Объект обработчик тестовых заданий. Чаще всего представляет собой кластер из нескольких экземпляров браузера. Реализация
по умолчанию позволяет контролировать их количество:

```ts
export default {
  runner: RUNNER.pool({ agentsCount: 4 }),
  /* ... */
};
```

:::note
Нет чёткой формулы определяющей рекомендуемое количество агентов. Подходящее значение стоит определять опытным путём.
:::

## capture

Функция снятия снимка страницы в _стабильном_ состоянии.

:::note
Страница считается стабильной, если её визуальное представление не изменяется, то есть она "замирает".
:::

По умолчанию используются оптимальные настройки для алгоритма стабилизации, но их можно изменить:

```ts
export default {
  /**
   * Выполняет мнговенный снимок экрана, минуя стадию стабилизации.
   * (Не рекомендуется для большинства сценариев)
   */
  capture: CAPTURE.instantly,
  /* ... */
};
```

## compare

Описывает алгоритм сравнения двух изображений.

:::note
По умолчанию `storyshots` использует алгоритм, учитывающий особенности
человеческого цветовосприятия, что делает тесты менее хрупкими.
:::

### withPlaywright

Делегирует сравнение снимков `playwright`:

```ts
export default {
  compare: COMPARE.withPlaywright(options),
  /* ... */
};
```

---

#### comparator

Алгоритм сравнения пикселей:

- ssim-cie94 - https://en.wikipedia.org/wiki/Structural_similarity_index_measure
- pixelmatch - использует https://www.npmjs.com/package/pixelmatch

#### threshold

Погрешность при сравнении (от 0 до 1, где 0 это максимальная строгость). Работает только для pixelmatch

#### maxDiffPixels

Максимально допустимая разница в пикселях. 0 по умолчанию

##### maxDiffPixelRatio

Максимально допустимая разница в пикселях (отношение: от 0 до 1). 0 по умолчанию

### withLooksSame

Использует [looks-same](https://github.com/gemini-testing/looks-same).

```ts
export default {
  compare: COMPARE.withLooksSame(options),
  /* ... */
};
```

:::note
Доступны все основные [опции](https://github.com/gemini-testing/looks-same?tab=readme-ov-file#comparing-images) за
исключением `createDiffImage` (diff создаётся всегда так как является обязательным для `storyshots`)
:::

### Оптимальный алгоритм

Не смотря на то, что библиотека поддерживает из коробки минимально необходимый набор алгоритмов, он может оказаться не
подходящим под конкретные задачи проекта.

:::tip
Подходящий алгоритм, это такой алгоритм который обеспечивает минимальное количество ложных срабатываний (хрупких
тестов), но при этом не пропускает дефекты (обеспечивает высокую защиту от регресса)
:::

Именно поэтому `storyshots` позволяет реализовать своё решение:

```typescript
{
  compare: (actual, expected, story) => Promise<ComparisonResult>;
  /* ... */
}
```

- _actual_ снимок актуального поведения
- _expected_ снимок эталонного поведения
- _story_ объект истории включая [мета атрибуты](/API/factories/it#storyattributes)

Результатом алгоритма является объект `ComparisonResult` в котором содержится:

- _equal_ - признак равенства двух снимков
- _explanation_ - если два снимка не равны, содержит дополнительную информацию
- _diff_ - ссылается на итоговое diff изображение

:::tip
Интерфейс сравнения является ассинхронным, что открывает дополнительные возможности по использованию более продвинутых
техник сравнения, например с использованием online сервисов.
:::
