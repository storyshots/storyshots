import type { PreviewServerFactory } from '@storyshots/core/manager';

/**
 * https://storyshots.github.io/storyshots/modules/msw#createworkersupplier
 */
export function createWorkerSupplier(): PreviewServerFactory {
  return () => ({
    handler: (req, res, next) => {
      if (req.url.includes('mockServiceWorker.js')) {
        res.sendFile(require.resolve('msw/mockServiceWorker.js'));

        return;
      }

      return next();
    },
  });
}
