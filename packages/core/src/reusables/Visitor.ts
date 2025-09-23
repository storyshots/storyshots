export const Visitor = {
  when<TStruct, THandlers>(
    implementation: (
      struct: TStruct,
      handlers: Cases<HandlerResult, THandlers>,
    ) => HandlerResult,
  ): <T>(struct: TStruct, cases: FallbackCases<T, THandlers>) => T {
    return (struct, cases) =>
      implementation(struct, toHandlers(cases)) as never;
  },
};

type FallbackCases<T, THandlers> =
  | Cases<T, THandlers>
  | Fallback<T, Cases<T, THandlers>>;

type Fallback<T, THandlers> = Partial<THandlers> & {
  otherwise(): T;
};

type Cases<T, THandlers> = {
  [TCase in keyof THandlers]: THandlers[TCase] extends (
    ...args: never[]
  ) => unknown
    ? (...args: Parameters<THandlers[TCase]>) => T
    : never;
};

function toHandlers<THandlers>(
  cases: FallbackCases<unknown, THandlers>,
): Cases<HandlerResult, THandlers> {
  if ('otherwise' in cases) {
    return new Proxy(
      {},
      {
        get: (_, method) => {
          if (method in cases) {
            return cases[method as never];
          }

          return cases.otherwise;
        },
      },
    ) as never;
  }

  return cases as never;
}

type HandlerResult = {
  readonly name: unique symbol;
};
