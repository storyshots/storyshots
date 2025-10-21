import { createStoryFactories } from '@storyshots/next';
import { Externals } from '@/storyshots/arrangers';

export const { it, createOnStorySwitch } = createStoryFactories<Externals>({
  createExternals: () => ({}) as Externals,
  createJournalExternals: (externals) => externals,
});
