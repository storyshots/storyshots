import { assertNotEmpty } from '@lib';
import { StoryConfig } from '@storyshots/core';
import { JournalRecord } from '@storyshots/core/devkit';
import React, { useMemo } from 'react';
import { ExternalsFactory } from '../types';

type Props = {
  active: NonNullable<ReturnType<typeof window.onPreviewReady>>;
  factory: ExternalsFactory<unknown>;
};

export const View: React.FC<Props> = (props) => {
  const story = props.active.story;

  const result = useMemo(
    () => fromThrowable(() => createBindComponents(props)),
    [],
  );

  if (!result.success) {
    console.error(result.error);

    return <h1>Initialization error, check console for more details</h1>;
  }

  const {
    data: { externals, config },
  } = result;

  assertNotEmpty(story.render, 'Render must be defined');

  return story.render(externals, config);
};

function createBindComponents({ factory, active }: Props) {
  const config: StoryConfig = {
    device: active.env.device,
    previewing: active.env.previewing,
    journal: createExposeJournal(),
  };

  const defaults = factory.createExternals(config);
  const arranged = active.story.arrange?.(defaults, config) ?? defaults;
  const externals = factory.createJournalExternals(arranged, config);

  return { config, externals: externals };
}

function createExposeJournal(): StoryConfig['journal'] {
  const records: JournalRecord[] = [];

  window.getJournalRecords = async () => records;

  const journal: StoryConfig['journal'] = {
    record: (method, ...args) => {
      records.push({ method, args });
    },
    asRecordable:
      (method, fn) =>
      (...args) => {
        journal.record(method, ...args);

        return fn(...args);
      },
  };

  return journal;
}

function fromThrowable<T>(
  fn: () => T,
): { success: true; data: T } | { success: false; error: unknown } {
  try {
    return {
      success: true,
      data: fn(),
    };
  } catch (error) {
    return { success: false, error };
  }
}
