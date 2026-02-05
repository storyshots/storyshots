import { isNil } from './guards';

export function assertIsNever(
  input?: never,
  message = 'Should never be called'
): never {
  throw new Error(message);
}

export function assertNotEmpty<T>(
  input: T | undefined | null,
  message = 'Expected to be defined'
): asserts input is T {
  if (isNil(input)) {
    throw new Error(message);
  }
}

export function assert(
  input: unknown,
  message = 'Assertion is false'
): asserts input {
  if (!input) {
    throw new Error(message);
  }
}
