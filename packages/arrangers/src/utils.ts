/**
 * https://storyshots.github.io/storyshots/modules/arrangers#resolves
 */
export const resolves =
  <T>(result: T) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (...args: unknown[]) =>
    result;

/**
 * https://storyshots.github.io/storyshots/modules/arrangers#rejects
 */
export const rejects =
  (error?: unknown) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (...args: unknown[]): Promise<never> =>
    Promise.reject(error);

export const iterated = <T>(values: T[]) => {
  let iter = 0;

  return async (): Promise<Awaited<T>> => {
    const result = values[iter % values.length];

    iter += 1;

    return result as Awaited<T>;
  };
};
