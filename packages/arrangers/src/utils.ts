export const resolves =
  <T>(result: T) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (...args: unknown[]) =>
    result;

export const rejects =
  (error?: unknown) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (...args: unknown[]): Promise<never> =>
    Promise.reject(error);
