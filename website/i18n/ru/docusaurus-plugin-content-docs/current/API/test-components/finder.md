---
sidebar_position: 2
---

# finder {#finder}

Специальный объект для конструирования селекторов.

---

## getByRole {#getbyrole}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-role)

## getByText {#getbytext}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-text)

## getByLabel {#getbylabel}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-label)

## getByPlaceholder {#getbyplaceholder}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-placeholder)

## getByAltText {#getbyalttext}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-alt-text)

## getByTitle {#getbytitle}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-title)

## getByTestId {#getbytestid}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-test-id)

## locator {#locator}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-locator)

## filter {#filter}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-filter)

## nth {#nth}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-nth)

## first {#first}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-first)

## last {#last}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-last)

## and {#and}

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-and)

## get {#get}

Позволяет расширять селекторы используя специальные трансформеры:

```ts
function byButtonSeverity(severity: string): FinderTransformer {
  return (finder) => finder.get('button').filter({ hasText: severity });
}

finder.get(byButtonSeverity('error')); // <button class="error">Error</button>
```
