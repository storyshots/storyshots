export function createURL(path: string) {
  return `${process.env.__NEXT_PRIVATE_ORIGIN ?? ''}${path}`;
}
