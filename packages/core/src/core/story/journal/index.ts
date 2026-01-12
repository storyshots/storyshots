export type JournalRecord = {
  method: string;
  args: unknown[];
};

/**
 * https://storyshots.github.io/storyshots/API/test-components/story-config#journal
 */
export type Journal = {
  /**
   * https://storyshots.github.io/storyshots/API/test-components/story-config#record
   */
  record(method: string, ...args: unknown[]): unknown;

  /**
   * https://storyshots.github.io/storyshots/API/test-components/story-config#asrecordable
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
