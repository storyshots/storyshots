import { ScreenshotPath } from '../../reusables/types';
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from 'react-compare-slider';
import React from 'react';
import { ACTUAL_BORDER_COLOR, EXPECTED_BORDER_COLOR } from './constants';
import { driver } from '../../reusables/runner/driver';

type Props = {
  expected: ScreenshotPath;
  actual: ScreenshotPath;
};

export const GitLikeImageComparator: React.FC<Props> = ({
  expected,
  actual,
}) => {
  return (
    <ReactCompareSlider
      itemOne={
        <ReactCompareSliderImage
          src={driver.createImgSrc(expected)}
          style={{
            border: `1px solid ${EXPECTED_BORDER_COLOR}`,
            width: 'unset',
            height: 'unset',
            maxHeight: '100%',
            maxWidth: '100%',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      }
      itemTwo={
        <ReactCompareSliderImage
          src={driver.createImgSrc(actual)}
          style={{
            border: `1px solid ${ACTUAL_BORDER_COLOR}`,
            width: 'unset',
            height: 'unset',
            maxHeight: '100%',
            maxWidth: '100%',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      }
      handle={
        <ReactCompareSliderHandle linesStyle={{ backgroundColor: '#acacac' }} />
      }
      style={{ height: '100%' }}
    />
  );
};
