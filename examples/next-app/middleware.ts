import { getResponse } from 'msw';
import { toRequestHandlers } from '@storyshots/msw-externals';
import { NextMiddleware, NextResponse } from 'next/server';
import { onStorySwitch } from '@/storyshots/onStorySwitch';

export const runtime = 'nodejs';

export const middleware = onStorySwitch<NextMiddleware>({
  onStory: (externals) => async (request) =>
    getResponse(toRequestHandlers(externals.endpoints), request),
  otherwise: () => () => NextResponse.next(),
});

export const config = {
  matcher: '/api/:path*',
};
