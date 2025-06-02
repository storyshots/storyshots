import { install } from '@storyshots/web-api-externals';

// 13.01.2024
export const clock = install({
  now: new Date(2024, 0, 13, 12),
  shouldAdvanceTime: true,
});
