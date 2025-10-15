import React from 'react';
import { UseBehaviourProps } from '../behaviour/types';
import { RecordsSelection } from '../behaviour/useSelection/types';
import { Spinner } from '../reusables/Spinner';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Accept';
import { DiffReader } from './DiffReader';


import { UIStoryRunState } from '../behaviour/useRun/types';

type Props = {
  selection: RecordsSelection;
} & Pick<UseBehaviourProps, 'accept' | 'results'>;

export const Records: React.FC<Props> = ({ selection, results, accept }) => {
  const result = results.device(selection.story.id, selection.device);

  return UIStoryRunState.when(result, {
    onNoResults: () => (
      <span>Records are not generated yet, for given device</span>
    ),
    onScheduled: () => <Spinner />,
    onRunning: () => <Spinner />,
    onError: (error) => (
      <div dangerouslySetInnerHTML={{ __html: error.message }} />
    ),
    onDone: ({ records }) => {
      const title = `[${selection.device.name}] ${selection.story.title}`;

      if (records.type === 'fresh') {
        return (
          <Workspace
            title={title}
            actions={
              <ActionAccept
                onAction={() =>
                  accept([
                    {
                      id: selection.story.id,
                      device: selection.device,
                      changes: { records, screenshots: [] },
                    },
                  ])
                }
              />
            }
          >
            <DiffReader
              oldValue={JSON.stringify(records.actual, null, 2)}
              newValue={JSON.stringify(records.actual, null, 2)}
              showDiffOnly={false}
              splitView={false}
              hideLineNumbers={false}
              single
            />
          </Workspace>
        );
      }

      if (records.type === 'pass') {
        return (
          <Workspace title={title}>
            <DiffReader
              oldValue={JSON.stringify(records.actual, null, 2)}
              newValue={JSON.stringify(records.actual, null, 2)}
              showDiffOnly={false}
              splitView={false}
              hideLineNumbers={false}
              single
            />
          </Workspace>
        );
      }

      return (
        <Workspace
          title={title}
          actions={
            <ActionAccept
              onAction={() =>
                accept([
                  {
                    id: selection.story.id,
                    device: selection.device,
                    changes: { records, screenshots: [] },
                  },
                ])
              }
            />
          }
        >
          <DiffReader
            oldValue={JSON.stringify(records.expected, null, 2)}
            newValue={JSON.stringify(records.actual, null, 2)}
            showDiffOnly={false}
            hideLineNumbers={false}
          />
        </Workspace>
      );
    },
  });
};
