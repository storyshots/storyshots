import { useEffect, useState } from 'react';
import { assert } from '../../../reusables/utils';

export function usePreviewBuildHash(): string {
  const [hash, setHash] = useState('Initializing');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.addEventListener('message', (event) => {
      assert(typeof event.data === 'string');

      setHash(event.data);
    });

    return () => ws.close();
  }, []);

  return hash;
}
