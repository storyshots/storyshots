import type { Page } from 'playwright';

/**
 * https://storyshots.github.io/storyshots/API/story-elements/finder
 */
export type Finder = {
  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-role
   */
  getByRole(role: ByRole['role'], options?: ByRoleOptions): Finder;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-text
   */
  getByText(text: TextMatch, options?: ByText['options']): Finder;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-label
   */
  getByLabel(text: TextMatch, options?: ByLabel['options']): Finder;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-placeholder
   */
  getByPlaceholder(text: TextMatch, options?: ByPlaceholder['options']): Finder;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-alt-text
   */
  getByAltText(text: TextMatch, options?: ByAltText['options']): Finder;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-title
   */
  getByTitle(text: TextMatch, options?: ByTitle['options']): Finder;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-get-by-test-id
   */
  getByTestId(testId: TextMatch): Finder;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-locator
   */
  locator(selector: string): Finder;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-filter
   */
  filter(options: WithFilterOptions): Finder;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-nth
   */
  nth(index: number): Finder;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-first
   */
  first(): Finder;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-last
   */
  last(): Finder;

  /**
   * https://playwright.dev/docs/api/class-locator#locator-and
   */
  and(selector: Finder): Finder;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#get
   */
  get(transformer: FinderTransformer): Finder;

  __toMeta(): FinderMeta;
};

export type FinderTransformer = (finder: Finder) => Finder;

export type FinderMeta = {
  beginning: ByLocator;
  consequent: Array<ByLocator | ByIndex | WithFilter | WithAnd>;
};

export type ByLocator = {
  type: 'locator';
  by:
    | ByRole
    | ByText
    | ByLabel
    | ByPlaceholder
    | ByAltText
    | ByTitle
    | BySelector
    | ByTestId;
};

type ByRoleOptions = Parameters<Page['getByRole']>[1];

export type ByRole = {
  type: 'role';
  role: Parameters<Page['getByRole']>[0];
  options: ByRoleOptions;
};

export type ByText = { type: 'text' } & ByTextLike;

export type ByLabel = { type: 'label' } & ByTextLike;

export type ByPlaceholder = { type: 'placeholder' } & ByTextLike;

export type ByAltText = { type: 'alt-text' } & ByTextLike;

export type ByTitle = { type: 'title' } & ByTextLike;

export type ByTestId = { type: 'test-id' } & ByTextLike;

type ByTextLike = {
  text: TextMatch;
  options?: { exact?: boolean };
};

export type BySelector = {
  type: 'selector';
  selector: string;
};

export type WithAnd = {
  type: 'and';
  condition: FinderMeta;
};

type WithFilterOptions = {
  has?: Finder;
  hasNot?: Finder;
  hasText?: TextMatch;
  hasNotText?: TextMatch;
};

export type WithFilter = {
  type: 'filter';
  options: {
    has?: FinderMeta;
    hasNot?: FinderMeta;
    hasText?: TextMatch;
    hasNotText?: TextMatch;
  };
};

export type ByIndex = {
  type: 'index';
  options:
    | {
        kind: 'first';
      }
    | {
        kind: 'last';
      }
    | {
        kind: 'nth';
        at: number;
      };
};

export type TextMatch = string | RegExp;
