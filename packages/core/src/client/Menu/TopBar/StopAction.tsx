import { StopOutlined } from '@ant-design/icons';
import React from 'react';
import { UseBehaviourProps } from '../../behaviour/types';
import { EntryAction } from '../reusables/EntryAction';

import { UIStoryRunState } from '../../behaviour/useRun/types';

type Props = Pick<UseBehaviourProps, 'stop' | 'results'>;

export const StopAction: React.FC<Props> = ({ stop, results }) => {
  const scheduled = results.all().some((result) =>
    UIStoryRunState.when(result.state, {
      onScheduled: () => true,
      onRunning: () => true,
      otherwise: () => false,
    }),
  );

  if (!scheduled) {
    return;
  }

  return (
    <EntryAction
      label="Stop"
      icon={<StopOutlined />}
      action={(e) => {
        e.stopPropagation();

        stop();
      }}
    />
  );
};
