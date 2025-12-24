import { createArrangers } from '@storyshots/arrangers';
import { createMSWArrangers, Endpoints } from '@storyshots/msw-externals';

export type Externals = {
  endpoints: Endpoints;
};

const arrangers = createArrangers<Externals>();

export const { arrange } = arrangers;
export const { endpoint, handle, record } = createMSWArrangers(arrangers.focus('endpoints'));
