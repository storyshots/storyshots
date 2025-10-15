import { Device } from '@core';
import { assertNotEmpty, isNil } from '@lib';
import { useTypedQSPRoxy } from '../../useTypedQSPRoxy';

export function usePreviewDevice(devices: Device[]) {
  const qs = useTypedQSPRoxy();
  const selected = parse();

  return {
    // User selected preview device
    emulate: selected,
    // Resolved preview device (which is used implicitly but which may not be emulated)
    resolved: selected ?? devices[0],
    set: (device: Device | undefined) =>
      device ? qs.set('preview', device) : qs.delete('preview'),
  };

  function parse() {
    const preview = qs.get('preview');

    if (isNil(preview)) {
      return;
    }

    const device = devices.find((it) => it.name === preview.name);

    assertNotEmpty(device, 'Invalid device configuration. Please restart');

    return device;
  }
}
