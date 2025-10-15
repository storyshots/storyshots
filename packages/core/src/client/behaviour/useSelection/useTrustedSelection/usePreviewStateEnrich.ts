import { StoryID, StoryTree, toRunnableStoryMeta } from '@core';
import { useEffect, useState } from 'react';
import { driver } from '../../../../reusables/driver';
import { Selection } from '../types';
import { ManagerConfig } from '../useManagerConfig';
import { isNil } from '@lib';
import { WithPossibleError } from '../../../../reusables/error';

/**
 * Enriches preview state each time it is being reset.
 *
 * Which is when stories are emitted, *by definition*.
 */
export function usePreviewStateEnrich(
  trusted: Selection,
  manager: ManagerConfig,
  stories: StoryTree | undefined,
) {
  const [enriched, setEnriched] = useState<EnrichState>();

  useEffect(() => void enrich(trusted, manager), [stories]);

  return enriched;

  async function enrich(trusted: Selection, manager: ManagerConfig) {
    if (trusted.type !== 'story') {
      return;
    }

    const runnable = toRunnableStoryMeta(
      trusted.story,
      manager.preview.resolved,
      {
        previewing: true,
      },
    );

    if (runnable.type === 'error') {
      console.error(runnable.message);

      return setEnriched({
        for: trusted.story.id,
        details: runnable,
      });
    }

    if (isNil(runnable.data)) {
      return;
    }

    setEnriched({ for: trusted.story.id });

    const result = await driver.play(runnable.data.actions);

    setEnriched({
      for: trusted.story.id,
      details: result,
    });
  }
}

export type EnrichState =
  | undefined
  | {
      for: StoryID;
      details?: WithPossibleError<void>;
    };
