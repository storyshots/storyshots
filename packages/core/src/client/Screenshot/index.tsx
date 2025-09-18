import { isNil } from '@lib';
import React from 'react';
import { UseBehaviourProps } from '../behaviour/types';
import { ScreenshotSelection } from '../behaviour/useSelection/types';
import { Spinner } from '../reusables/Spinner';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Accept';
import { FailedScreenshotsViewer } from './FailedScreenshotsViewer';
import { Screenshots } from './Screenshots';
import { Viewer } from './Viewer';

type Props = {
  selection: ScreenshotSelection;
} & Pick<UseBehaviourProps, 'acceptScreenshot' | 'results'>;

export const Screenshot: React.FC<Props> = ({
  selection,
  results,
  acceptScreenshot,
}): React.ReactElement => {
  const result = results.get(selection.story.id)?.get(selection.device);

  if (isNil(result)) {
    return <span>Screenshots are not generated yet, for a given device</span>;
  }

  if (result.type === 'running' || result.type === 'scheduled') {
    return <Spinner />;
  }

  if (result.details.type === 'error') {
    return (
      <span>Error has been caught during last run. Check the errors pane.</span>
    );
  }

  const screenshot = result.details.data.screenshots.find(
    (it) => it.name === selection.name,
  );

  if (isNil(screenshot)) {
    return <span>Given screenshot is missing</span>;
  }

  const title = `[${selection.device.name}] ${selection.story.title} ${screenshot.name}`;

  if (screenshot.type === 'fresh') {
    return (
      <Workspace
        title={title}
        actions={
          <ActionAccept
            onAction={() =>
              acceptScreenshot(selection.story.id, selection.device, screenshot)
            }
          />
        }
      >
        <Viewer.Container>
          <Viewer.Main>
            <Screenshots
              items={[{ path: screenshot.actual, color: '#1677ff' }]}
            />
          </Viewer.Main>
        </Viewer.Container>
      </Workspace>
    );
  }

  if (screenshot.type === 'pass') {
    return (
      <Workspace title={title}>
        <Viewer.Container>
          <Viewer.Main>
            <Screenshots
              items={[{ path: screenshot.actual, color: 'transparent' }]}
            />
          </Viewer.Main>
        </Viewer.Container>
      </Workspace>
    );
  }

  return (
    <Workspace
      title={title}
      actions={
        <ActionAccept
          onAction={() =>
            acceptScreenshot(selection.story.id, selection.device, screenshot)
          }
        />
      }
    >
      <FailedScreenshotsViewer
        key={selection.device.name}
        device={selection.device}
        {...screenshot}
      />
    </Workspace>
  );
};
