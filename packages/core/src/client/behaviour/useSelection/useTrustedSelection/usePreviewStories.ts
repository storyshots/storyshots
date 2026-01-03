import { find, StoryTree } from '@core';
import { useEffect, useState } from 'react';
import { ManagerConfig } from '../useManagerConfig';
import { UserSelection } from '../useUserSelection';
import { useTypedQSPRoxy } from '../../useTypedQSPRoxy';
import { assertNotEmpty } from '@lib';

/**
 * Returns preview state as simple tree of stories.
 *
 * Preview state is considered as new each time new tree is emitted.
 *
 * State might be new when:
 * * Preview was reloaded. For example during webpack build (Live reloading).
 * * Preview stories were changed. As a subset of the former.
 *
 * TODO: It makes behaviours including `window.location.reload` impossible to test.
 */
export function usePreviewStories(
  untrusted: UserSelection,
  manager: ManagerConfig,
) {
  const qs = useTypedQSPRoxy();
  const [stories, setStories] = useState<StoryTree>();

  useEffect(() => {
    window.onPreviewReady = (stories, config) => {
      // Exposing app frame reference
      // TODO: Can global refs be avoided?
      window.getAppFrameRef = () => config.frame;

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
        env: {
          device: manager.preview.resolved,
          previewing: true,
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
        const host = qs.get('at');

        assertNotEmpty(host);

        frame.src = host;
      }
    };
  }, [untrusted, manager.preview.resolved]);

  return stories;
}
