export const createStoryFactories: typeof import('./neutral').createStoryFactories =
  () => {
    return {
      it: banned,
      describe: banned,
      each: banned,
      createOnStorySwitch:
        () =>
        ({ otherwise }) =>
          otherwise(),
    };

    function banned(): never {
      throw new Error(
        'Storyshots API should not be used in production environment',
      );
    }
  };

export const ModeInjector: typeof import('./client').ModeInjector = () => null;

export const createStoryRootComponent: typeof import('./client').createStoryRootComponent =

    () =>
    ({ children }) =>
      children;

export const stories: import('@storyshots/core').StoryTree<unknown> = [];
