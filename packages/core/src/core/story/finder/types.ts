import type { Page } from 'playwright';

/**
 * https://storyshots.github.io/storyshots/API/story-elements/finder
 */
export type Finder = {
  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#getbyrole
   */
  getByRole(role: ByRole['role'], options?: ByRoleOptions): Finder;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#getbytext
   */
  getByText(text: TextMatch, options?: ByText['options']): Finder;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#getbylabel
   */
  getByLabel(text: TextMatch, options?: ByLabel['options']): Finder;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#getbyplaceholder
   */
  getByPlaceholder(text: TextMatch, options?: ByPlaceholder['options']): Finder;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#getbyalttext
   */
  getByAltText(text: TextMatch, options?: ByAltText['options']): Finder;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#getbytitle
   */
  getByTitle(text: TextMatch, options?: ByTitle['options']): Finder;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#locator
   */
  locator(selector: string): Finder;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#filter
   */
  filter(options: WithFilterOptions): Finder;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#nth
   */
  nth(index: number): Finder;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#first
   */
  first(): Finder;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#last
   */
  last(): Finder;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/finder#and
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
    | BySelector;
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
