import React from 'react';

export const createStoryFactories = () => {
  return {
    createOnStorySwitch:
      () =>
      ({ otherwise }: { otherwise(): unknown }) =>
        otherwise(),
  };
};

export const ModeInjector: React.FC = () => null;

export const createStoryRootComponent =
  (): React.FC<React.PropsWithChildren> =>
    ({ children }) =>
      children;

export const stories = [];
