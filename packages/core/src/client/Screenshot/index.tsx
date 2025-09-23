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


import { UIStoryRunState } from '../behaviour/useRun/types';

type Props = {
  selection: ScreenshotSelection;
} & Pick<UseBehaviourProps, 'accept' | 'results'>;

export const Screenshot: React.FC<Props> = ({
  selection,
  results,
  accept,
}): React.ReactElement => {
  const result = results.device(selection.story.id, selection.device);

  return UIStoryRunState.when(result, {
    onNoResults: () => (
      <span>Screenshots are not generated yet, for a given device</span>
    ),
    onRunning: () => <Spinner />,
    onScheduled: () => <Spinner />,
    onError: (error) => (
      <div dangerouslySetInnerHTML={{ __html: error.message }} />
    ),
    onDone: ({ screenshots }) => {
      const screenshot = screenshots.find((it) => it.name === selection.name);

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
                  accept([
                    {
                      id: selection.story.id,
                      device: selection.device,
                      changes: { screenshots: [screenshot] },
                    },
                  ])
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
                accept([
                  {
                    id: selection.story.id,
                    device: selection.device,
                    changes: { screenshots: [screenshot] },
                  },
                ])
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
    },
  });
};
