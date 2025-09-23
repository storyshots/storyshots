import { useSearchParams } from 'wouter';
import { createTypedQSProxy } from '../../reusables/createTypedQSProxy';

export function useTypedQSPRoxy() {
  const [params, setParams] = useSearchParams();

  return createTypedQSProxy({
    // Do not pass by reference, otherwise context is lost
    get: (key) => params.get(key),
    delete: (key) =>
      setParams((prev) => {
        prev.delete(key);

        return prev;
      }),
    set: (key, value) =>
      setParams((prev) => {
        prev.set(key, value);

        return prev;
      }),
  });
}
