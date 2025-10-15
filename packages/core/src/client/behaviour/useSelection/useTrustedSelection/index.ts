import { useMemo } from 'react';
import { Selection } from '../types';
import { ManagerConfig } from '../useManagerConfig';
import { UserSelection } from '../useUserSelection';
import { useJoinSelection } from './useJoinSelection';
import { usePreviewStories } from './usePreviewStories';
import { EnrichState, usePreviewStateEnrich } from './usePreviewStateEnrich';
import { isNil } from '@lib';

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
  const enriched = usePreviewStateEnrich(joint, manager, stories);

  return useMemo(
    () => enrichWithPlayingSelection(enriched, joint),
    [enriched, joint],
  );
}

function enrichWithPlayingSelection(
  progress: EnrichState,
  selection: Selection,
): Selection {
  if (selection.type !== 'story') {
    return selection;
  }

  if (isNil(progress)) {
    return { ...selection, progress: { type: 'not-played' } };
  }

  if (progress.for !== selection.story.id) {
    return { ...selection, progress: { type: 'not-played' } };
  }

  if (isNil(progress.details)) {
    return { ...selection, progress: { type: 'playing' } };
  }

  return {
    ...selection,
    progress: { type: 'played', details: progress.details },
  };
}
