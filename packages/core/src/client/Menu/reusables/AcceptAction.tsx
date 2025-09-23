import { CheckOutlined } from '@ant-design/icons';
import React from 'react';
import { UseBehaviourProps } from '../../behaviour/types';
import { EntryAction } from './EntryAction';
import { StoryBoundChange } from '../../behaviour/useAcceptBaseline';

type Props = Pick<UseBehaviourProps, 'accept' | 'accepting'> & {
  changes: StoryBoundChange[];
};

export const AcceptAction: React.FC<Props> = ({
  accept,
  changes,
  accepting,
}) => {
  if (changes.length === 0) {
    return;
  }

  return (
    <EntryAction
      label="Accept all"
      icon={<CheckOutlined />}
      disabled={accepting}
      action={async (e) => {
        e.stopPropagation();

        void accept(changes);
      }}
    />
  );
};
