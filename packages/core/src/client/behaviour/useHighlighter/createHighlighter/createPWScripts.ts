import { getConsoleApiUtils } from './getConsoleApiUtils';
import { getInjectedScript } from './getInjectedScript';

export async function createPWScripts(frame: Window) {
  const injectedScript = await getInjectedScript(frame);
  const utils = await getConsoleApiUtils(frame, injectedScript);

  return {
    injectedScript,
    utils
  };
}
