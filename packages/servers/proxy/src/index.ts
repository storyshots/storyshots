import { IPreviewServer } from '@storyshots/core/manager';
import { createProxyMiddleware } from 'http-proxy-middleware';

/**
 * https://storyshots.github.io/storyshots/modules/proxy#createproxyserver
 */
export function createProxyServer(to: string): IPreviewServer {
  return {
    handler: createProxyMiddleware({
      target: to,
      changeOrigin: true,
    }),
    cleanup: async () => {},
  };
}
