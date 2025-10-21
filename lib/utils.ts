export function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function assertIsNever(
  input?: never,
  message = 'Should never be called',
): never {
  throw new Error(message);
}

export function assertNotEmpty<T>(
  input: T | undefined | null,
  message = 'Expected to be defined',
): asserts input is T {
  if (isNil(input)) {
    throw new Error(message);
  }
}

export function assert(
  input: unknown,
  message = 'Assertion is false',
): asserts input {
  if (!input) {
    throw new Error(message);
  }
}

export function isNil(input: unknown): input is null | undefined {
  return input === undefined || input === null;
}

export function isDefined<T>(input: T): input is Exclude<T, undefined | null> {
  return !isNil(input);
}

/**
 * Omits only functions appearing on first level of a record for simplicity.
 *
 * Used to convert structs to serializable entities
 */
export type ToJSONLike<T> = T extends JSONLike
  ? T
  : {
      [TKey in keyof T as T[TKey] extends (...args: never[]) => unknown
        ? never
        : TKey]: ToJSONLike<T[TKey]>;
    };

type JSONLike =
  | string
  | number
  | boolean
  | null
  | JSONLike[]
  | { [key: string]: JSONLike };

export type PathsOf<T> = _PathOf<T, keyof T>;

export type GetByPath<TPath extends string, TType> = TPath extends keyof TType
  ? TType[TPath]
  : TPath extends `${infer THead extends keyof TType & string}.${infer TRest}`
    ? GetByPath<TRest, TType[THead]>
    : unknown;

type _PathOf<T, TKey extends keyof T> = TKey extends string
  ? T[TKey] extends Record<string, any>
    ? TKey | `${TKey}.${_PathOf<T[TKey], keyof T[TKey]>}`
    : TKey
  : never;
