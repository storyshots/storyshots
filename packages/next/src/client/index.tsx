'use client';

import React, { useEffect, useState } from 'react';
import { StoryTree } from '@storyshots/core';
import { wait } from '@lib';
import { onModeSwitch } from '../neutral/onModeSwitch';
import { DefinedActiveStory } from '../neutral/types';
import { exposeAndGetJournalState } from '../neutral/createSharedJournal';
import { createENVFromKey, getFromENVByKey } from '../neutral/safe-env';

export function createStoryRootComponent(
  stories: StoryTree<unknown>,
): React.FC<React.PropsWithChildren> {
  return ({ children }) =>
    onModeSwitch<React.ReactNode>({
      onPreview: () => <Preview stories={stories} />,
      onStory: () => {
        // Exposing journal ref globally upon story initialization
        exposeAndGetJournalState();

        return children;
      },
      onBuild: () => children,
      onDefault: () => children,
    });
}

export const ModeInjector: React.FC = () => {
  const env = Object.entries(
    createENVFromKey('STORYSHOTS_MODE', getFromENVByKey('STORYSHOTS_MODE')),
  )
    .map(([key, value]) => `['${key}']: '${value}'`)
    .join(',');

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `Object.assign(window, { ${env} })`,
      }}
    />
  );
};

function Preview({ stories }: { stories: StoryTree<unknown> }) {
  const [host, setHost] = useState<string>();

  useEffect(() => {
    document.body.style.margin = '0px';

    const active = parent.onPreviewReady(stories, {
      frame: {
        type: 'id',
        value: 'content',
      },
    });

    if (active) {
      return run(active, setHost);
    }
  }, []);

  return host ? (
    <iframe
      id="content"
      src={host}
      style={{
        display: 'block',
        border: 'none',
        width: '100%',
        height: '100vh',
      }}
    />
  ) : (
    <h1>Select a story</h1>
  );
}

function run(
  active: DefinedActiveStory,
  onReady: (host: string) => void,
): () => void {
  const controller = new AbortController();

  void _run();

  return () => controller.abort('Cancelled');

  async function _run() {
    try {
      await wait(0);
      controller.signal.throwIfAborted();

      const sse = new EventSource(
        `/__run_story_instance?active=${encodeURIComponent(
          JSON.stringify(active),
        )}`,
      );

      sse.addEventListener('message', (event) =>
        onReady(`${event.data}${active.story.at ?? ''}`),
      );

      controller.signal.addEventListener('abort', () => sse.close());
    } catch (error) {
      if (error === 'Cancelled') {
        return;
      }

      throw error;
    }
  }
}
