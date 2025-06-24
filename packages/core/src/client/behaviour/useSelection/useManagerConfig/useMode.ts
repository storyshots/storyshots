import { Mode } from '@core';
import { assert, assertNotEmpty } from '@lib';
import { useSearchParams } from 'wouter';

export function useMode(): Mode {
  const [params] = useSearchParams();
  const mode = params.get('mode');

  assertNotEmpty(mode, 'Mode is required');
  assertIsMode(mode);

  return mode;
}

function assertIsMode(mode: string): asserts mode is Mode {
  assert(['ui', 'background'].includes(mode), 'Mode is not supported');
}
