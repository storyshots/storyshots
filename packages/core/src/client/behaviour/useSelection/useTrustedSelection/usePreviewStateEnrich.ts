import { createActor, StoryEnvironment, StoryTree } from '@core';
import { useEffect, useState } from 'react';
import { driver } from '../../../../reusables/runner/driver';
import { Progress, Selection } from '../types';
import { ManagerConfig } from '../useManagerConfig';

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
  const [progress, setProgress] = useState<Progress>({ type: 'not-played' });

  useEffect(() => void enrich(trusted, manager), [stories]);

  return progress;

  async function enrich(trusted: Selection, manager: ManagerConfig) {
    setProgress({ type: 'not-played' });

    if (trusted.type !== 'story') {
      return;
    }

    setProgress({ type: 'playing' });

    const env: StoryEnvironment = {
      testing: false,
      device: manager.device.preview,
    };

    const actions = trusted.story.act(createActor(env), env).__toMeta();

    const result = await driver.play(actions);

    setProgress({
      type: 'played',
      result,
    });
  }
}
