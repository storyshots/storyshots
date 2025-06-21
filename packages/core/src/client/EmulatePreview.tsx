import React from 'react';
import { UseBehaviourProps } from './behaviour/types';
import {
  RecordsSelection,
  ScreenshotSelection,
} from './behaviour/useSelection/types';
import { Preview } from './reusables/Preview';

type Props = Pick<UseBehaviourProps, 'emulated' | 'device'> & {
  selection: Exclude<
    UseBehaviourProps['selection'],
    ScreenshotSelection | RecordsSelection
  >;
};

export const EmulatePreview: React.FC<Props> = (props) => {
  const { selection } = props;

  // TODO: Are to checks necessary? Must test it
  if (selection.type === 'initializing' || !props.emulated) {
    return <Preview />;
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <Preview
        style={{
          width: `${props.device.preview.width}px`,
          height: `${props.device.preview.height}px`,
          margin: 'auto',
          border: '1px solid rgb(206, 206, 206)',
        }}
      />
    </div>
  );
};
