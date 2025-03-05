import React from 'react';
import { UseBehaviourProps } from './behaviour/types';
import { EmulatedReplayPreview } from './EmulatedReplayPreview';
import { Records } from './Records';
import { usePreviewConnection } from './reusables/ConnectedPreview';
import { Screenshot } from './Screenshot';

export const Main: React.FC<UseBehaviourProps> = (props) => {
  const preview = usePreviewConnection({
    state: {
      devices: props.devices,
      device: props.device.preview,
      testing: false,
      id:
        props.selection.type === 'story' ? props.selection.story.id : undefined,
    },
    onPreviewLoaded: props.onPreviewLoaded,
  });

  return render();

  function render() {
    if (props.selection.type === 'screenshot') {
      return (
        <Screenshot
          selection={props.selection}
          results={props.results}
          acceptScreenshot={props.acceptScreenshot}
        />
      );
    }

    if (props.selection.type === 'records') {
      return (
        <Records
          selection={props.selection}
          results={props.results}
          acceptRecords={props.acceptRecords}
        />
      );
    }

    return (
      <EmulatedReplayPreview
        {...preview}
        selection={props.selection}
        emulated={props.emulated}
        device={props.device}
      />
    );
  }
};
