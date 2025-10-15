import { assertNotEmpty } from '@lib';
import { useTypedQSPRoxy } from '../../useTypedQSPRoxy';

export function usePoolSize() {
  const qs = useTypedQSPRoxy();
  const size = qs.get('size');

  assertNotEmpty(size, 'Pool size is required');

  return size;
}
