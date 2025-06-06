import { ManagerConfig } from './useManagerConfig';
import { useTrustedSelection } from './useTrustedSelection';
import { useUserSelection } from './useUserSelection';

export function usePreviewSyncSelection(manager: ManagerConfig) {
  const { selection, ...handlers } = useUserSelection();
  
  return {
    selection: useTrustedSelection(selection, manager),
    ...handlers,
  };
}
