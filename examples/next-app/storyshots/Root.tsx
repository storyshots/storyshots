'use client';

import { createStoryRootComponent } from '@storyshots/next/client';

import { stories } from '@/storyshots/stories';

export const Root = createStoryRootComponent(stories);
