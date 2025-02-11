import { createPreviewApp } from '@storyshots/react-preview';
import { StoryTree } from '@storyshots/react-preview/src/tree/types';
import { callback } from './pure-function-factory';
import { ModuleArgs } from './module';

export function createDefaultStoriesFactory(): CreateStories<unknown> {
  return () => [];
}

export function fromStoriesFactory(
  factory: CreateStories<unknown>,
): CreateStories<unknown> {
  return factory;
}

export function fromStoryFactory(
  factory: CreateStory<unknown>,
): CreateStories<unknown> {
  return callback(factory, ([module, config]) => [
    module.it('is a story', config(module)),
  ]);
}

export type StoryConfig<T> = Parameters<RunArgs<T>['it']>[1];
export type CreateStory<T> = (args: ModuleArgs) => StoryConfig<T>;
export type CreateStories<T> = (args: RunArgs<T>) => StoryTree[];

export type RunArgs<T> = ModuleArgs & ReturnType<typeof createPreviewApp<T>>;
