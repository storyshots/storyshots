import React from 'react';
import { UseBehaviourProps } from './behaviour/types';
import { EmulatePreview } from './EmulatePreview';
import { Records } from './Records';
import { Screenshot } from './Screenshot';

export const Main: React.FC<UseBehaviourProps> = (props) => {
  if (props.selection.type === 'screenshot') {
    return <Screenshot {...props} selection={props.selection} />;
  }

  if (props.selection.type === 'records') {
    return <Records {...props} selection={props.selection} />;
  }

  return <EmulatePreview {...props} selection={props.selection} />;
};
