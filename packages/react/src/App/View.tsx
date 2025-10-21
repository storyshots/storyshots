import { assertNotEmpty } from '@lib';
import { StoryConfig } from '@storyshots/core';
import { JournalRecord } from '@storyshots/core/toolbox';
import React, { useMemo } from 'react';
import { ExternalsFactory } from '../types';

type Props = {
  active: NonNullable<ReturnType<typeof window.onPreviewReady>>;
  factory: ExternalsFactory<unknown>;
};

export const View: React.FC<Props> = (props) => {
  const story = props.active.story;
  const { config, externals } = useMemo(() => createBindComponents(props), []);

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
