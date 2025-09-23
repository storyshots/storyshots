import React from 'react';
import { Props as ParentProps } from './types';
import { EntryTitle } from '../reusables/EntryTitle';
import styled from 'styled-components';
import { EntryHeader } from '../reusables/EntryHeader';
import { ExclamationOutlined } from '@ant-design/icons';
import { ArtefactsEntries } from './ArtefactsEntries';
import { EntryDuration } from '../reusables/EntryDuration';
import { DeviceBoundState } from '../../behaviour/useRun/useResults';

import { UIStoryRunState } from '../../behaviour/useRun/types';

type Props = ParentProps & {
  result: DeviceBoundState;
};

export const DeviceEntry: React.FC<Props> = (props) => {
  const {
    result: { state, device },
    level,
  } = props;

  return UIStoryRunState.when(state, {
    onError: (_, { duration }) => (
      <li aria-label={device.name}>
        <DeviceEntryHeader $level={level} $offset={8}>
          <EntryTitle
            left={<ExclamationOutlined style={{ color: '#f5222d' }} />}
            title={device.name}
          />
          <EntryDuration duration={duration} />
        </DeviceEntryHeader>
      </li>
    ),
    onDone: (details, { duration }) => (
      <li aria-label={device.name}>
        <DeviceEntryHeader $level={level} $offset={8}>
          <EntryTitle
            left={
              <span
                style={{ display: 'inline-block', width: 14, height: 14 }}
              />
            }
            title={device.name}
          />
          <EntryDuration duration={duration} />
        </DeviceEntryHeader>
        <ArtefactsEntries {...props} device={device} details={details} />
      </li>
    ),
    otherwise: () => undefined,
  });
};

const DeviceEntryHeader = styled(EntryHeader)`
  font-style: italic;
  pointer-events: none;
`;
