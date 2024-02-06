import React from 'react';
import { isNil } from '../../../reusables/utils';
import { Spinner } from '../../reusables/Spinner';
import { UseBehaviourProps } from '../behaviour/types';
import { SelectionState } from '../behaviour/useSelection';
import { Errors } from '../Errors';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Actions/Accept';

type RecordsSelection = Extract<
  SelectionState,
  {
    type: 'records';
  }
>;

type Props = {
  selection: RecordsSelection;
} & Pick<UseBehaviourProps, 'acceptRecords' | 'results'>;

export const RecordsOrErrors: React.FC<Props> = ({
  selection,
  results,
  acceptRecords,
}) => {
  const result = results.get(selection.story.id);
  const title = `${selection.story.title} — Records`;

  if (isNil(result)) {
    return <span>Records are not generated yet</span>;
  }

  if (result.running) {
    return <Spinner.AbsoluteStretched />;
  }

  if (result.type === 'error') {
    return <Errors result={result} />;
  }

  const records = result.records;

  if (records.type === 'fresh') {
    return (
      <Workspace
        title={title}
        actions={
          <ActionAccept
            onAction={() =>
              acceptRecords(selection.story, records.actual, result)
            }
          />
        }
      >
        <Workspace.DiffReader
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
        <Workspace.DiffReader
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
            acceptRecords(selection.story, records.actual, result)
          }
        />
      }
    >
      <Workspace.DiffReader
        oldValue={JSON.stringify(records.expected, null, 2)}
        newValue={JSON.stringify(records.actual, null, 2)}
        showDiffOnly={false}
        hideLineNumbers={false}
      />
    </Workspace>
  );
};
