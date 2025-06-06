import { useAcceptBaseline } from './useAcceptBaseline';
import { useExposeRunAll } from './useExposeRunAll';
import { useGroupExpand } from './useGroupExpand';
import { useHighlighter } from './useHighlighter';
import { useRun } from './useRun';
import { usePreviewSyncSelection } from './useSelection';
import { useManagerConfig } from './useSelection/useManagerConfig';
import { useStatusPane } from './useStatusPane';

export function useBehaviour() {
  const manager = useManagerConfig();
  const run = useRun(manager);
  const accept = useAcceptBaseline(run);
  const sync = usePreviewSyncSelection(manager);
  const expand = useGroupExpand(sync.selection);
  const pane = useStatusPane();
  const highlight = useHighlighter();

  useExposeRunAll(sync.selection, manager);

  return {
    ...manager,
    ...expand,
    ...sync,
    ...pane,
    ...run,
    ...accept,
    ...highlight,
  };
}
