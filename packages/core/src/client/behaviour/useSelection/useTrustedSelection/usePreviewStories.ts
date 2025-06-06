import { createJournal, find, StoryTree } from '@core';
import { useEffect, useState } from 'react';
import { ManagerConfig } from '../useManagerConfig';
import { UserSelection } from '../useUserSelection';

/**
 * Returns preview state as simple tree of stories.
 *
 * Preview state is considered as new each time new tree is emitted.
 *
 * State might be new when:
 * * Preview was reloaded. For example during webpack build (Live reloading).
 * * Preview stories were changed. As a subset of the former.
 *
 * **CAUTION**
 * It makes behaviours including `window.location.reload` impossible to test.
 */
export function usePreviewStories(
  untrusted: UserSelection,
  manager: ManagerConfig,
) {
  const [stories, setStories] = useState<StoryTree>();

  useEffect(() => {
    window.onPreviewReady = (stories) => {
      setStories(stories);

      if (untrusted.type === 'no-selection') {
        return undefined;
      }

      const story = find(untrusted.id, stories);

      if (story === undefined) {
        return undefined;
      }

      return {
        story,
        config: {
          device: manager.device.preview,
          testing: false,
          journal: createJournal(),
        },
      };
    };

    /**
     * Refreshing (e.g. resetting state) preview each time user selection changes.
     */
    return () => {
      const frame = document.querySelector('#preview') as
        | HTMLIFrameElement
        | undefined;

      if (frame) {
        frame.src = location.origin;
      }
    };
  }, [untrusted, manager.device.preview]);

  return stories;
}
