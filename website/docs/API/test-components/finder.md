---
sidebar_position: 2
---

# finder {#finder}

A special object for constructing selectors.

---

# getByRole {#getbyrole}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-role) method.

## getByText {#getbytext}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-text) method.

## getByLabel {#getbylabel}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-label) method.

## getByPlaceholder {#getbyplaceholder}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-placeholder) method.

## getByAltText {#getbyalttext}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-alt-text) method.

## getByTitle {#getbytitle}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-title) method.

## getByTestId {#getbytestid}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-test-id) method.

## locator {#locator}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-locator) method.

## filter {#filter}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-filter) method.

## nth {#nth}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-nth) method.

## first {#first}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-first) method.

## last {#last}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-last) method.

## and {#and}

Uses the original [`playwright`](https://playwright.dev/docs/api/class-locator#locator-and) method.

## get {#get}

Allows extending selectors using special transformers:

```ts
function byButtonSeverity(severity: string): FinderTransformer {
  return (finder) => finder.get('button').filter({ hasText: severity });
}

finder.get(byButtonSeverity('error')); // <button class="error">Error</button>
```
