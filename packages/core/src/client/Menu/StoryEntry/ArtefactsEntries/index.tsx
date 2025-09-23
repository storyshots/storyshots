import { RecordsEntry } from './RecordsEntry';
import { ScreenshotsEntry } from './ScreenshotsEntry';
import React, { ComponentProps } from 'react';

type Props = ComponentProps<typeof RecordsEntry> &
  ComponentProps<typeof ScreenshotsEntry>;

export const ArtefactsEntries: React.FC<Props> = (props) => {
  return (
    <>
      <RecordsEntry {...props} />
      <ScreenshotsEntry {...props} />
    </>
  );
};
