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

    void message.info('Selector has been copied!');
  };

  frame.addEventListener('click', listener);

  return () => frame.removeEventListener('click', listener);
}
