import styled from 'styled-components';
import React from 'react';
import { Duration } from '../../../reusables/duration';

type Props = { duration: Duration; className?: string };

const _EntryDuration: React.FC<Props> = ({ duration, className }) => {
  if (duration === Duration.zero()) {
    return;
  }

  return (
    <div aria-label="Run duration" className={className}>
      {Duration.toString(duration)}
    </div>
  );
};

export const EntryDuration = styled(_EntryDuration)`
  padding-left: 2px;
  color: #151515;
  font-style: italic;
`;
