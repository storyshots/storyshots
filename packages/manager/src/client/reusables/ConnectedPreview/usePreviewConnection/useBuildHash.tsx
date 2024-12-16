import { assert } from '@storyshots/core';
import { useEffect, useState } from 'react';

// Connects to preview bundler to retrieve actual content hash
export function useBuildHash() {
  const [hash, setHash] = useState<PreviewBuildHash>();

  useEffect(() => {
    const ws = new WebSocket(`ws://${location.host}?manager=SECRET`);

    ws.addEventListener('message', (event) => {
      assert(typeof event.data === 'string');

      setHash(event.data);
    });

    return () => ws.close();
  }, []);

  return hash;
}

export type PreviewBuildHash = string | undefined;
