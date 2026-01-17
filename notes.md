# MCP

UI mode must be in sync with MCP CLI

Write empty test with description

Define arrange
  Query "Мы на странице списка справочников. Нужные данные со списком элементов справочника. Пусть их будет 3 штуки". It must follow recommended stub patterns

Open test in preview

Define act
  Query "Сделай снимок страницы. И перейди в детали справочника"

Perform requested actions on UI-mode printing act implementation as a result
  Playwright generates page snapshot (example ./snapshot.md) using playwright-core\src\client\page.ts:870
  Tool playwright\src\mcp\browser\tools\snapshot.ts:24
  Snapshot list all elements including refs (indexes)
  Playwright accepts element index for a locator (locator('aria-ref=e5'))
  Then it is able to convert it to plain JS selector using playwright\src\mcp\browser\tab.ts:299
  Code is sent to agent and locator and given action is executed in the browser
  If element not found it prints playwright\src\mcp\browser\tab.ts:302
  Playwright probably does page snapshots before every action

Define screenshots
  Query "На снимке должна быть видна заполненная форма". Snapshot including action?

Define journal
  Query "Метод создания должен журналироваться". How to adapt specific arrange implementation pattern? (use arrange?)

Run specified tests (result must be provided for agent)

Option to recognize success baseline
Option to accept/review fresh baseline
Option to accept/review failed baseline

Option to handle error when running? It must see error text and be able to correctly interpret it to fix it by itself
  It must have access to console messages of preview

Set emulation mode
Set device run mode

# High priority

* Integrate react-devtools
* Add story search
    * Should work like live filter on groups and story contents
* Add coverage tool
* Add progress logging inside CI job
* Mark flaky tests on UI (Make device entry to be exact as story entry)
* Recorder (especially for mouse related events with coordinates)
* Allow to show only actual screenshot (add Actual switch)
* Memo screenshot mode selection between stories
* Implement IPreviewClient explicitly
* Fix naming for preview (like IPreviewClient). It is not preview, it is adapted AUT
* Add more details to resized docs (stories should be defined explicitly)
* Add labels for actual and expected images
* stop prevents final screenshot to be taken. It is useful when testing page transitions (update docs and tests)

# Low priority

* Impl antd tour guide
* Add baseline read button
* Implement antd actor extensions package
* Implement antd finder extensions package
* Verify that package meta is correct (module type, tags, dependencies etc.)
* Simplify UI components (introduce UI-lib, reuse and simplify concepts)
* Move to Disposable interface
* Add search to docs
* Add docs build check on PR
* Allow to extend preview server per story for next.js
* Ease creation of previews for @storyshots/core
    * Sparse global functions should be united (app ref, journal, etc.)
    * Preview kinds should be described explicitly (flat, nested/detached)
* Main models in @core must be simplified
    * Avoid usage of complex nexted types and structures (remove visitors and simplify duration type)
    * Try to rewrite state container using functional and side effect-less structures (streams)
* Configure prettier (format scripts) and linter (for imports, unused vars, private deps)
* Add cleanupObsolete docs

# Opened questions

* How to test shared components? For example selector opened state

# Useful links

playwright UI https://playwright.dev/docs/test-ui-mode

# Need to research more

* More screenshot patterns
    * Masking. What, how and when
    * Long pages. What, how and when
    * Async content. waitFor, trials and etc
    * Dynamic content.
        * Displaying time or how long it took to complete request. I could mock the timer or replace html content with
          static data using actor.exec fn
* Action specific stabilization
    * Find data (it could be animation having accordion)
* AI Engine to turn text commands in playwright API https://github.com/zerostep-ai/zerostep
    * Will it be useful?
    * How to integrate?
* Accessibility checking https://github.com/abhinaba-ghosh/axe-playwright
    * Will it be useful?
* Runtime exceptions handling (on act, arrange and render)
    * What is an exception?
    * Play function. When and how
    * Act function. When and how
