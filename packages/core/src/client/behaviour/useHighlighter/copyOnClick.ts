import { isNil } from '@lib';
import { message } from 'antd';
import { createPWScripts } from './createHighlighter/createPWScripts';
import { OnHighlightFinish } from './useHighlighting';

export function copyOnClick(
  frame: Window,
  { injectedScript }: Awaited<ReturnType<typeof createPWScripts>>,
): OnHighlightFinish {
  const listener = async () => {
    const selector = injectedScript?._highlight?._highlightOptions?.tooltipText;

    if (isNil(selector)) {
      return;
    }

    await navigator.clipboard.writeText(selector);

    showSuccess();
  };

  frame.addEventListener('click', listener);

  return () => frame.removeEventListener('click', listener);
}

const showSuccess = toOnceAtTimePromise(() =>
  message.info('Selector has been copied!'),
);

function toOnceAtTimePromise(fn: () => PromiseLike<unknown>): () => unknown {
  let locked = false;

  return () => {
    if (locked) {
      return;
    }

    locked = true;

    void fn().then(() => (locked = false));
  };
}
