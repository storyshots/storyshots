import type { NextConfig } from 'next';
import { extendNextConfig } from '@storyshots/next/preview';
import path from 'node:path';

const nextConfig: NextConfig = extendNextConfig({
  storiesRoot: path.join(process.cwd(), 'storyshots', 'stories'),
  config: {},
});

export default nextConfig;
