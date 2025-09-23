import { createJournal, find, StoryID } from '@core';
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
    window.onPreviewReady = (stories) => {
      const story = find(props.params.story as StoryID, stories);
      const preview = qs.get('preview');

      assertNotEmpty(story);
      assertNotEmpty(preview);

      const journal = createJournal();

      // Exposing records for server
      window.getJournalRecords = () => journal.__read();

      return {
        story,
        config: {
          device: preview,
          journal,
          previewing: false,
        },
      };
    };
  }, []);

  return <Preview />;
};
