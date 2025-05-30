import { assertNotEmpty } from '@lib';
import { useSearchParams } from 'wouter';

export function usePoolSize(): number {
  const [params] = useSearchParams();
  const size = params.get('size');

  assertNotEmpty(size, 'Pool size is required');

  return parseInt(size);
}
