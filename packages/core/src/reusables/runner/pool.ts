import { isDefined } from '@lib';

export async function* pool<T>(
  generators: Array<AsyncGenerator<T, void>>,
  size: number,
): AsyncIterable<T, void> {
  const working = new Set(generators.slice(0, size).map(createWork));
  const unprocessed = generators.slice(size);

  while (working.size > 0) {
    const { state, generator, work } = await Promise.race(working);

    working.delete(work);

    if (state.done) {
      const candidate = unprocessed.shift();

      if (isDefined(candidate)) {
        working.add(createWork(candidate));
      }

      continue;
    }

    yield state.value;

    working.add(createWork(generator));
  }

  function createWork(generator: AsyncGenerator<T, void>) {
    const work: Work = generator
      .next()
      .then((state) => ({ state, generator, work }));

    type Work = Promise<{
      state: IteratorResult<T>;
      generator: AsyncGenerator<T, void>;
      work: Work;
    }>;

    return work;
  }
}
