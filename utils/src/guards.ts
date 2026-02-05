export function isNil(input: unknown): input is null | undefined {
  return input === undefined || input === null;
}

export function isDefined<T>(input: T): input is Exclude<T, undefined | null> {
  return !isNil(input);
}
