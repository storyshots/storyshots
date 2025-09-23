import React from 'react';
import { UseBehaviourProps } from './behaviour/types';
import { Preview } from './reusables/Preview';
import { isNil } from '@lib';

type Props = Pick<UseBehaviourProps, 'preview'>;

export const EmulatePreview: React.FC<Props> = (props) => {
  const { preview } = props;

  if (isNil(preview.emulate)) {
    return <Preview />;
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <Preview
        style={{
          width: `${preview.emulate.width}px`,
          height: `${preview.emulate.height}px`,
          margin: 'auto',
          border: '1px solid rgb(206, 206, 206)',
        }}
      />
    </div>
  );
};
