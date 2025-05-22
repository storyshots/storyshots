/**
 * https://storyshots.github.io/storyshots/API/story-elements/journal
 */
export type Journal = {
  /**
   * https://storyshots.github.io/storyshots/API/story-elements/journal#record
   */
  record(method: string, ...args: unknown[]): void;

  /**
   * https://storyshots.github.io/storyshots/API/story-elements/journal#asrecordable
   */
  asRecordable<TArgs extends unknown[], TReturn>(
    method: string,
    fn: (...args: TArgs) => TReturn,
  ): (...args: TArgs) => TReturn;

  __read(): JournalRecord[];
};

export type JournalRecord = {
  method: string;
  args: unknown[];
};
