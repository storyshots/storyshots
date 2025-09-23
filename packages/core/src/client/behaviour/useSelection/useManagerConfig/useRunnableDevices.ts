import { Device, DeviceName } from '@core';
import { useTypedQSPRoxy } from '../../useTypedQSPRoxy';

export function useRunnableDevices(devices: Device[]) {
  const qs = useTypedQSPRoxy();
  const selected = parse();

  return {
    // User selected devices to run (can be empty)
    selected,
    // Resolved devices to run
    resolved: selected.length === 0 ? [devices[0]] : selected,
    set: (devices: Device[]) =>
      qs.set(
        'runnables',
        devices.map((it) => it.name),
      ),
  };

  function parse() {
    const runnables = qs.get('runnables') ?? [];

    return devices.filter((device) => runnables.includes(device.name));
  }
}

declare global {
  interface QSStorage {
    // Device names to be run tests against
    runnables: DeviceName[];
  }
}
