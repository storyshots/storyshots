import { Device } from '@core';
import { assertNotEmpty } from '@lib';
import { useMemo } from 'react';
import { useTypedQSPRoxy } from '../../useTypedQSPRoxy';

export function useDevices(): Device[] {
  const qs = useTypedQSPRoxy();
  const devices = qs.get('devices');

  assertNotEmpty(devices);

  return useMemo(() => devices, [JSON.stringify(devices)]);
}
