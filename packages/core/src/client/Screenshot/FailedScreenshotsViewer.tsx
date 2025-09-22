import { Device } from '@core';
import { Radio, RadioChangeEvent } from 'antd';
import React, { useState } from 'react';
import { ScreenshotComparisonResult } from '../../reusables/runner/types';
import { assertIsNever, assertNotEmpty } from '@lib';
import { GitLikeImageComparator } from './GitLikeImageComparator';
import { Viewer } from './Viewer';
import { Screenshots } from './Screenshots';
import { ACTUAL_BORDER_COLOR, EXPECTED_BORDER_COLOR } from './constants';

enum ViewerMode {
  TwoUp = 'twoup',
  Swipe = 'swipe',
  Diff = 'diff',
}

type Props = Extract<ScreenshotComparisonResult, { type: 'fail' }> & {
  device: Device;
};

export const FailedScreenshotsViewer: React.FC<Props> = (props) => {
  const [mode, setMode] = useState(
    props.device.width > props.device.height
      ? ViewerMode.Swipe
      : ViewerMode.TwoUp,
  );

  return (
    <Viewer.Container>
      <Viewer.Main>{renderImageComparison()}</Viewer.Main>
      <Viewer.Bottom>
        {props.explanation && <span>{props.explanation}</span>}
        <Radio.Group
          size="small"
          value={mode}
          onChange={(e: RadioChangeEvent) =>
            setMode(e.target.value as ViewerMode)
          }
        >
          <Radio.Button value={ViewerMode.TwoUp}>2-up</Radio.Button>
          <Radio.Button value={ViewerMode.Swipe}>Swipe</Radio.Button>
          {props.diff && (
            <Radio.Button value={ViewerMode.Diff}>Diff</Radio.Button>
          )}
        </Radio.Group>
      </Viewer.Bottom>
    </Viewer.Container>
  );

  function renderImageComparison() {
    switch (mode) {
      case ViewerMode.TwoUp:
        return renderTwoUp();
      case ViewerMode.Swipe:
        return renderActualExpectedSwipe();
      case ViewerMode.Diff:
        return renderDiff();
    }

    assertIsNever(mode);
  }

  function renderDiff() {
    assertNotEmpty(props.diff);

    return <Screenshots items={[{ path: props.diff, color: 'transparent' }]} />;
  }

  function renderActualExpectedSwipe() {
    return (
      <GitLikeImageComparator expected={props.expected} actual={props.actual} />
    );
  }

  function renderTwoUp() {
    return (
      <Screenshots
        items={[
          { path: props.expected, color: EXPECTED_BORDER_COLOR },
          { path: props.actual, color: ACTUAL_BORDER_COLOR },
        ]}
      />
    );
  }
};
