import { find, StoryID } from '@core';
import { assertNotEmpty } from '@lib';
import React, { useEffect } from 'react';
import { RouteComponentProps } from 'wouter';
import { Preview } from './reusables/Preview';
import { useTypedQSPRoxy } from './behaviour/useTypedQSPRoxy';

type Props = RouteComponentProps<{
  story: string;
}>;

export const ForChromiumOnly: React.FC<Props> = (props) => {
  const qs = useTypedQSPRoxy();

  useEffect(() => {
    window.onPreviewReady = (stories, config) => {
      const story = find(props.params.story as StoryID, stories);
      const preview = qs.get('preview');

      assertNotEmpty(story);
      assertNotEmpty(preview);

      // Exposing app frame reference
      window.getAppFrameRef = () => config.frame;

      return {
        story,
        env: {
          device: preview,
          previewing: false,
        },
      };
    };
  }, []);

  return <Preview />;
};
