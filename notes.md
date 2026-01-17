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
