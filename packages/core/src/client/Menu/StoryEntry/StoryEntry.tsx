import { blue } from '@ant-design/colors';
import React from 'react';
import { AcceptAction } from '../reusables/AcceptAction';
import { EntryActions } from '../reusables/EntryActions';
import { ActiveEntryHeader } from '../reusables/EntryHeader';
import { toStatusByResults } from '../reusables/toStatusByResults';
import { HighlightableEntry } from '../reusables/HighlightableEntry';
import { RunAction } from '../reusables/RunAction';
import { Props } from './types';
import { EntryDuration } from '../reusables/EntryDuration';
import { ArtefactsEntries } from './ArtefactsEntries';
import { DeviceEntry } from './DeviceEntry';
import { toStoryBoundChanges } from './toStoryBoundChanges';

import { UIStoryRunState } from '../../behaviour/useRun/types';
import { assertIsNever } from '@lib';

export const StoryEntry: React.FC<Props> = (props) => {
  const { story } = props;

  const results = props.results.story(story.id);

  const status = toStatusByResults(
    results.map(({ state }) => state).concat(createStateFromPlay()),
  );

  return (
    <li aria-label={story.title}>
      <ActiveEntryHeader
        $offset={8}
        $level={props.level}
        $active={isActive()}
        $color={blue[0]}
        onClick={() => props.setStory(story.id)}
        role="menuitem"
      >
        <HighlightableEntry status={status} title={story.title} />
        <EntryActions status={status}>
          <AcceptAction
            changes={toStoryBoundChanges(story.id, results)}
            accept={props.accept}
            accepting={props.accepting}
          />
          <RunAction stories={[story]} run={props.run} />
        </EntryActions>
        {results.length === 1 &&
          UIStoryRunState.when(results[0].state, {
            onError: (_, { duration }) => <EntryDuration duration={duration} />,
            onDone: (_, { duration }) => <EntryDuration duration={duration} />,
            otherwise: () => undefined,
          })}
      </ActiveEntryHeader>
      {renderResultEntries()}
    </li>
  );

  function createStateFromPlay(): UIStoryRunState[] {
    if (
      props.selection.type !== 'story' ||
      props.selection.story.id !== story.id
    ) {
      return [];
    }

    switch (props.selection.progress.type) {
      case 'not-played':
        return [];
      case 'playing':
        return [UIStoryRunState.create.running()];
      case 'played': {
        return props.selection.progress.details.type === 'error'
          ? [UIStoryRunState.create.error(props.selection.progress.details)]
          : [];
      }
    }

    assertIsNever(props.selection.progress);
  }

  function renderResultEntries() {
    if (results.length === 1) {
      return UIStoryRunState.when(results[0].state, {
        onDone: (details) => (
          <ArtefactsEntries
            {...props}
            device={results[0].device}
            details={details}
          />
        ),
        otherwise: () => undefined,
      });
    }

    return (
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyleType: 'none',
        }}
      >
        {results.map((result, index) => (
          <DeviceEntry key={index} {...props} result={result} />
        ))}
      </ul>
    );
  }

  function isActive() {
    return (
      props.selection.type === 'story' && props.selection.story.id === story.id
    );
  }
};
