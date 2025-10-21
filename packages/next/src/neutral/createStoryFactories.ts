import { createBindStoryFactories } from '@storyshots/core/toolbox';
import { createOnStorySwitchFactory } from './createOnStorySwitchFactory';
import { ExternalsFactory } from './types';

export function createStoryFactories<TExternals>(
  factories: ExternalsFactory<TExternals>,
) {
  return {
    ...createBindStoryFactories<TExternals>(),
    createOnStorySwitch: createOnStorySwitchFactory(factories),
  };
}
