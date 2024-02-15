import React from 'react';
import { isNil } from '../../reusables/utils';
import { Placeholder } from './Placeholder';
import { ScreenshotReadyStory } from './ScreenshotReadyStory';
import { Story } from './Story';
import { Props } from './types';
import { useManagerChannel } from './useManagerChannel';

export const Preview: React.FC<Props> = (props) => {
  const { id, screenshotting } = useManagerChannel(props);

  if (isNil(id)) {
    return <Placeholder />;
  }

  if (screenshotting) {
    return <ScreenshotReadyStory id={id} {...props} />;
  }

  return <Story id={id} {...props} />;
};
