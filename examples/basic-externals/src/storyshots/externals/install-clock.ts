import { install } from '@storyshots/web-api-mocks';

// 13.01.2024 12:00
export const clock = install({
  now: new Date(2024, 0, 13, 12, 0, 0, 0),
});
