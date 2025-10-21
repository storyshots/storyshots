import { assertNotEmpty, isNil } from '@lib';
import { useState } from 'react';

export function useHighlighting(cb: OnHighlightStart) {
  const [onDone, setOnDone] = useState<OnHighlightFinish>();
  const highlighting = !isNil(onDone);

  return {
    toggleHighlighting: async () => {
      if (highlighting) {
        onDone();

        setOnDone(undefined);

        return;
      }

      const stop = await cb(toPreviewFrame());

      setOnDone(() => stop);
    },
    highlighting,
  };
}

function toPreviewFrame() {
  const reference = window.getAppFrameRef();

  switch (reference.type) {
    case 'self':
      return frame('preview');
    case 'id':
      return frame(reference.value, frame('preview').document);
  }

  function frame(id: string, context = document) {
    const result = context.querySelector<HTMLIFrameElement>(`#${id}`)
      ?.contentWindow;

    assertNotEmpty(result, `Frame ${id} was not found`);

    return result;
  }
}

type OnHighlightStart = (frame: Window) => Promise<OnHighlightFinish>;

export type OnHighlightFinish = () => void;
