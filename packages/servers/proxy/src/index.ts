import { PreviewServerFactory } from '@storyshots/core/manager';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';

/**
 * https://storyshots.github.io/storyshots/modules/proxy#createproxyserver
 */
export function createProxyServer(
  to: string,
  options?: Options,
): PreviewServerFactory {
  return () => ({
    handler: createProxyMiddleware({
      target: to,
      changeOrigin: true,
      ws: true,
      ...options,
    }),
  });
}
