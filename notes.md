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

Define locator for a given element

Define screenshots
  Query "На снимке должна быть видна заполненная форма". Snapshot including action?
  Playwright allows to take screenshots and send them via 'image' type playwright\src\mcp\browser\response.ts:190

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

Example of mainly code generation capabilities playwright\src\mcp\browser\tools\verify.ts

Option to search docs?

# QUESTIONS
How to assert element waitFor state if it is not appeared yet? Snapshot can not be taken coz there is no such element
Why playwright uses different type of element queries? playwright\src\mcp\browser\tools\verify.ts:36 (by role) 

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
* fix long records display (overflow)

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
  * Choose a canonical context
    * Feature A = “reference implementation” of List behavior.
  * Test List deeply there
    * Pagination
    * Sorting
    * Keyboard
    * Edge cases
    * Error states
  * Elsewhere
    * Assume List mechanics are correct
    * Test only:
      * Data arrives
      * Items render
      * User can complete the feature’s goal
  * If Feature X extends List
      * You add new tests
      * Cover only new or modified behavior
      * You do not re-test baseline List behavior
  * What is “baseline List behavior” and who owns it must be explicitly defined
  * Emergent behavior only exists where behavior is modified or intersected.
    If Feature B:
       Uses List as-is
       With standard inputs
       With no timing, state, or ownership changes
       Then no new emergent behavior exists to test.
    If Feature X:
       Adds infinite scroll
       Overrides selection
       Shares state with another widget
       Changes lifecycle
       Then you correctly:
       Add new tests in Feature X
       That’s not duplication — that’s behavioral delta testing.
    ❌ Do not:
       “Just in case” re-test pagination everywhere
       Copy-paste deep List tests
       Parameterize deep tests across features
    Those actions:
       Add little signal
       Increase noise
       Slow everything down
You’re intuitively doing something right:
Feature A is the most complex List usage
That means:
It exercises the widest behavior surface
It’s the best proxy for the abstraction
As long as:
Feature A remains representative
You move ownership if a more complex case appears
If Feature X becomes more complex than A:
👉 promote X to canonical context
* More precisely:

You are testing behavior ownership

You are testing deltas, not duplicates

You are assuming correctness where no new behavior exists

You are reacting to composition risk, not fear

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
