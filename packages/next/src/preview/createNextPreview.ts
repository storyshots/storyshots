import { merge, PreviewServerFactory, tap } from '@storyshots/core/manager';
import { createProxyServer } from '@storyshots/proxy';
import { runStaticPreview } from './runStaticPreview';
import { runWatchPreview } from './runWatchPreview';

export const createNextPreview = (): PreviewServerFactory =>
  merge(
    tap((config) =>
      config.mode === 'ui' ? runWatchPreview() : runStaticPreview(),
    ),
    createProxyServer('http://localhost:3000'),
  );
