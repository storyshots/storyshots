import { copyOnClick } from './copyOnClick';
import { createPWScripts } from './createHighlighter/createPWScripts';
import { highlightOnHover } from './highlightOnHover';
import { useHighlighting } from './useHighlighting';

export function useHighlighter() {
  return useHighlighting(async (frame) => {
    const scripts = await createPWScripts(frame);
    const cleanHover = highlightOnHover(frame, scripts);
    const cleanClick = copyOnClick(frame, scripts);

    return () => {
      cleanHover();

      cleanClick();

      scripts.injectedScript.hideHighlight();
    };
  });
}
