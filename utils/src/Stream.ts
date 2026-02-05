export type Stream<TEmit, TReturn> = AsyncGenerator<TEmit, TReturn, void>;

export const Stream = {
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
