import React from 'react';
import { ScreenshotName } from '../../../reusables/types';
import { isNil } from '../../../reusables/utils';
import { useExternals } from '../../externals/Context';
import { UseBehaviourProps } from '../behaviour/types';
import { SelectionState } from '../behaviour/useSelection';
import {
  ScreenshotComparisonResult,
  SuccessTestResult,
} from '../behaviour/useTestResults/types';
import { Errors } from '../Errors';
import { Workspace } from '../Workspace';
import { ActionAccept } from '../Workspace/Actions/Accept';

type ScreenshotSelection = Extract<
  SelectionState,
  {
    type: 'screenshot';
  }
>;

type Props = {
  selection: ScreenshotSelection;
} & Pick<UseBehaviourProps, 'acceptScreenshot' | 'results'>;

export const Screenshot: React.FC<Props> = ({
  selection,
  results,
  acceptScreenshot,
}): React.ReactElement => {
  const { driver } = useExternals();
  const result = results.get(selection.story.id);
  const title = `${selection.story.title} — ${selection.name ?? 'FINAL'}`;

  if (isNil(result)) {
    return <span>Screenshots are not generated yet</span>;
  }

  if (result.running) {
    return <span>Screenshots are being generated</span>;
  }

  if (result.type === 'error') {
    return <Errors result={result} />;
  }

  const primary = result.screenshots.primary.results;

  if (isNil(selection.name)) {
    return renderSelectedScreenshotResults(undefined, primary.final, result);
  }

  const selectedOtherScreenshot = primary.others.find(
    (it) => it.name === selection.name,
  );

  if (isNil(selectedOtherScreenshot)) {
    return <span>Given screenshot is missing</span>;
  }

  return renderSelectedScreenshotResults(
    selectedOtherScreenshot.name,
    selectedOtherScreenshot.result,
    result,
  );

  function renderSelectedScreenshotResults(
    name: ScreenshotName | undefined,
    result: ScreenshotComparisonResult,
    results: SuccessTestResult,
  ): React.ReactElement {
    switch (result.type) {
      case 'fresh':
        return (
          <Workspace
            title={title}
            actions={
              <ActionAccept
                onAction={() =>
                  acceptScreenshot(
                    selection.story,
                    name,
                    result.actual,
                    results,
                  )
                }
              />
            }
          >
            <Workspace.ImgViewer
              src={driver.createScreenshotPath(result.actual)}
            />
          </Workspace>
        );
      case 'pass':
        return (
          <Workspace title={title}>
            <Workspace.ImgViewer
              src={driver.createScreenshotPath(result.actual)}
            />
          </Workspace>
        );
      case 'fail':
        return (
          <Workspace
            title={title}
            actions={
              <ActionAccept
                onAction={() =>
                  acceptScreenshot(
                    selection.story,
                    name,
                    result.actual,
                    results,
                  )
                }
              />
            }
          >
            <Workspace.DiffImgViewer
              leftImage={driver.createScreenshotPath(result.expected)}
              rightImage={driver.createScreenshotPath(result.actual)}
            />
          </Workspace>
        );
    }
  }
};
