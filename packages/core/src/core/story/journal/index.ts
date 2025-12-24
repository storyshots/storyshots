export type JournalRecord = {
  method: string;
  args: unknown[];
};

/**
 * https://storyshots.github.io/storyshots/API/story-elements/journal
 */
export type Journal = {
  /**
   * https://storyshots.github.io/storyshots/API/story-elements/journal#record
   */
  record(method: string, ...args: unknown[]): unknown;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/journal#asrecordable
   */
  asRecordable<TArgs extends unknown[], TReturn>(
    method: string,
    fn: (...args: TArgs) => TReturn,
    /**
     * Journals can be async, so this return type for asRecordable is generally incorrect.
     * But will leave it as is for usage simplicity reasons.
     */
  ): (...args: TArgs) => TReturn;
};
