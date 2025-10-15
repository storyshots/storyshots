import React from 'react';
import styled from 'styled-components';
import { UseBehaviourProps } from '../../behaviour/types';
import { isDefined } from '@lib';


import { UIStoryRunState } from '../../behaviour/useRun/types';

type Props = React.PropsWithChildren<{
  className?: string;
}>;

const _EntryActions: React.FC<Props> = (props) => {
  return <div className={props.className}>{props.children}</div>;
};

export const EntryActions = styled(_EntryActions)`
  display: flex;
  gap: 4px;
`;

export const IdleActions: React.FC<
  React.PropsWithChildren & Pick<UseBehaviourProps, 'results'>
> = ({ children, results }) => {
  const running = results
    .all()
    .map((result) =>
      UIStoryRunState.when(result.state, {
        onRunning: () => result,
        otherwise: () => undefined,
      }),
    )
    .filter(isDefined).length;

  if (running === 0) {
    return children;
  }

  return;
};
