export function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function notImplemented(): never {
  throw new Error('Not implemented');
}

export type PathsOf<T> = {
  [TKey in keyof T]: TKey extends string
    ? `${TKey}` | `${TKey}.${PathsOf<T[TKey]>}`
    : never;
}[keyof T];

export type GetByPath<TPath extends string, TType> = TPath extends keyof TType
  ? TType[TPath]
  : TPath extends `${infer THead extends keyof TType & string}.${infer TRest}`
  ? GetByPath<TRest, TType[THead]>
  : unknown;
