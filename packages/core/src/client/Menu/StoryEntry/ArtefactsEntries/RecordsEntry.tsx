import { blue } from '@ant-design/colors';
import { ProfileOutlined } from '@ant-design/icons';
import React from 'react';
import { ActiveEntryHeader } from '../../reusables/EntryHeader';
import { HighlightableEntry } from '../../reusables/HighlightableEntry';
import { Props as ParentProps } from '../types';
import { Device } from '@core';


import { StoryRunResult } from '../../../../reusables/runner/StoryRunResult';

type Props = ParentProps & {
  device: Device;
  details: StoryRunResult;
};

export const RecordsEntry: React.FC<Props> = ({
  story,
  level,
  device,
  details,
  selection,
  setRecords,
}) => {
  return (
    <>
      <ActiveEntryHeader
        $level={level}
        $offset={24}
        $active={isActive()}
        $color={blue[0]}
        role="menuitem"
        aria-label="Records"
        onClick={() => setRecords(story.id, device.name)}
      >
        <HighlightableEntry
          title="Records"
          left={<ProfileOutlined style={{ marginRight: 4 }} />}
          status={details.records.type}
        />
      </ActiveEntryHeader>
    </>
  );

  function isActive() {
    return (
      selection.type === 'records' &&
      selection.story.id === story.id &&
      selection.device === device
    );
  }
};
