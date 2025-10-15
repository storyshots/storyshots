import React from 'react';
import { UseBehaviourProps } from '../../behaviour/types';
import { isDefined } from '@lib';


import { UIStoryRunState } from '../../behaviour/useRun/types';

import { StoryRunResult } from '../../../reusables/runner/StoryRunResult';

type Props = Pick<UseBehaviourProps, 'results' | 'toggleStatusPane'>;

export const OverallStatus: React.FC<Props> = ({
  results,
  toggleStatusPane,
}) => {
  return (
    <a
      href="#"
      aria-label="Progress"
      style={{ flex: 1 }}
      onClick={toggleStatusPane}
    >
      {renderStatusText()}
    </a>
  );

  function renderStatusText(): string {
    const summary = {
      total: total(),
      pass: pass(),
    };

    if (summary.total === 0) {
      return 'Status';
    }

    return `${summary.pass}/${summary.total} passed (${(
      (summary.pass / summary.total) *
      100
    ).toFixed()}%)`;
  }

  function pass() {
    return results
      .all()
      .map((result) =>
        UIStoryRunState.when(result.state, {
          onDone: (details) =>
            StoryRunResult.changes(details) === undefined
              ? result
              : undefined,
          otherwise: () => undefined,
        }),
      )
      .filter(isDefined).length;
  }

  function total() {
    return results
      .all()
      .map((result) =>
        UIStoryRunState.when(result.state, {
          onNoResults: () => undefined,
          onScheduled: () => result,
          onRunning: () => result,
          onError: () => result,
          onDone: () => result,
        }),
      )
      .filter(isDefined).length;
  }
};
