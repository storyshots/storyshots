---
sidebar_position: 2
---

import { BalancedMetricsTip, Metric } from '@site/src/MetricsTip';
import { Diagram } from '@site/src/Diagram';

# Пользователь

<BalancedMetricsTip improves={[Metric.RegressionProtection, Metric.RefactoringAllowance, Metric.Maintainability]} />

Являясь частью секции [*аргументов*](/specification/requirements/borders#определение-границ) данный блок описывает
последовательность действий, которые пользователь предпринимает взаимодействуя с приложением.

Пример действий пользователя:
<Diagram src={require('./assets/user-events.drawio.png')} />

:::note
Компонент "пользователь" должен быть выделяемым, для того чтобы взятую последовательность действий можно было закрепить
за конкретным эталоном (результатом).
:::

## Связь с библиотекой

В библиотеке `storyshots` объекты [`actor`](/API/test-components/actor) и [`finder`](/API/test-components/finder) совместно представляют пользователя — агента, способного выполнять
различные действия на странице.

:::note
`storyshots` делает компонент "пользователь" выделяемым с помощью first class сущностей (в данном случае
объекта `actor`).
:::
