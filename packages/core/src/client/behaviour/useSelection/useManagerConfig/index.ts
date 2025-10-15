import { useRunnableDevices } from './useRunnableDevices';
import { useDevices } from './useDevices';
import { usePreviewDevice } from './usePreviewDevice';
import { usePoolSize } from './usePoolSize';

export function useManagerConfig() {
  const devices = useDevices();

  return {
    devices,
    size: usePoolSize(),
    runnables: useRunnableDevices(devices),
    preview: usePreviewDevice(devices),
  };
}

export type ManagerConfig = ReturnType<typeof useManagerConfig>;
