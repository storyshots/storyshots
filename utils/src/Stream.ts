export type Stream<TEmit, TReturn> = AsyncGenerator<TEmit, TReturn, void>;

export const Stream = {
  all: async function* <T>(generators: Stream<T, void>[]): Stream<T, void> {
    const jobs = new Map(generators.map((it) => [it, it.next()]));

    try {
      while (jobs.size > 0) {
        const { result, generator } = await Promise.race(
          jobs.entries().map(([generator, work]) =>
            work.then((result) => ({
              result,
              generator,
            })),
          ),
        );

        if (result.done) {
          jobs.delete(generator);

          continue;
        }

        jobs.set(generator, generator.next());

        yield result.value;
      }
    } finally {
      await Promise.allSettled(jobs.keys().map((it) => it.return()));
    }
  },
  toPromise: async <TEmit, TReturn>(
    stream: Stream<TEmit, TReturn>,
  ): Promise<[TEmit[], TReturn]> => {
    const emits: TEmit[] = [];

    while (true) {
      const iter = await stream.next();

      if (iter.done) {
        return [emits, iter.value];
      }

      emits.push(iter.value);
    }
  },
};
