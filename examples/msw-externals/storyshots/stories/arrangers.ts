import { createMSWArrangers, Endpoints } from '@storyshots/msw-externals';
import { createArrangers } from '@storyshots/arrangers';

const arrangers = createArrangers<Endpoints>();

export const { endpoint, handle, record, transform } = createMSWArrangers(arrangers);
export const { arrange } = arrangers;
