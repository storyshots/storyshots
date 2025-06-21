import { assertNotEmpty } from '@lib';
import { createPWScripts } from './createHighlighter/createPWScripts';
import { OnHighlightFinish } from './useHighlighting';

export function highlightOnHover(
  frame: Window,
  { injectedScript, utils }: Awaited<ReturnType<typeof createPWScripts>>,
): OnHighlightFinish {
  const listener = (event: MouseEvent) => {
    const element = frame.document.elementFromPoint(event.x, event.y);

    assertNotEmpty(element);

    injectedScript.highlight(
      injectedScript.parseSelector(utils.selector(element)),
    );
  };

  frame.addEventListener('mouseover', listener);

  return () => frame.removeEventListener('mouseover', listener);
}
