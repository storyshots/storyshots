import { blue } from '@ant-design/colors';
import { PictureOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';

import { ActiveEntryHeader } from '../../reusables/EntryHeader';
import { HighlightableEntry } from '../../reusables/HighlightableEntry';
import { Props as ParentProps } from '../types';
import { Device } from '@core';
import { ScreenshotComparisonResult, StoryRunResult } from '../../../../reusables/runner/StoryRunResult';

type Props = ParentProps & {
  device: Device;
  details: StoryRunResult;
};

export const ScreenshotsEntry: React.FC<Props> = ({
  story,
  level,
  details,
  device,
  selection,
  setScreenshot,
}) => {
  return (
    <ScreenshotsList>
      {details.screenshots.map((it) => (
        <li
          key={it.name}
          role="menuitem"
          aria-label={it.name}
          onClick={() => setScreenshot(story.id, it.name, device.name)}
        >
          <ActiveEntryHeader
            $level={level}
            $offset={24}
            $color={blue[0]}
            $active={isActive(it)}
          >
            <HighlightableEntry
              status={it.type}
              left={<PictureOutlined style={{ marginRight: 4 }} />}
              title={it.name}
            />
          </ActiveEntryHeader>
        </li>
      ))}
    </ScreenshotsList>
  );

  function isActive(screenshot: ScreenshotComparisonResult) {
    return (
      selection.type === 'screenshot' &&
      selection.story.id === story.id &&
      selection.device === device &&
      selection.name === screenshot.name
    );
  }
};

const ScreenshotsList = styled.ul`
  padding: 0;
  text-decoration: none;
`;
