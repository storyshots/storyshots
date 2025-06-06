import { useMemo } from 'react';
import { Progress, Selection } from '../types';
import { ManagerConfig } from '../useManagerConfig';
import { UserSelection } from '../useUserSelection';
import { useJoinSelection } from './useJoinSelection';
import { usePreviewStories } from './usePreviewStories';
import { usePreviewStateEnrich } from './usePreviewStateEnrich';

/**
 * Synchronizes user selection with the following:
 * * Actual Preview state
 * * Autoplay state
 */
export function useTrustedSelection(
  untrusted: UserSelection,
  manager: ManagerConfig,
) {
  const stories = usePreviewStories(untrusted, manager);
  const joint = useJoinSelection(untrusted, manager, stories);
  const progress = usePreviewStateEnrich(joint, manager, stories);

  return useMemo(
    () => enrichWithPlayingSelection(progress, joint),
    [progress, joint],
  );
}

function enrichWithPlayingSelection(
  progress: Progress,
  selection: Selection,
): Selection {
  if (selection.type === 'story') {
    return { ...selection, progress };
  }

  return selection;
}
