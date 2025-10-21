import { callback } from './pure-function-factory';
import { ModuleArgs } from './module';
import { createPreviewApp } from '@packages/react/src';
import { ExtendableStoryTree } from '@packages/core/src/core';

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
export type CreateStories<T> = (
  args: RunArgs<T>,
) => ExtendableStoryTree<unknown>;

export type RunArgs<T> = ModuleArgs & ReturnType<typeof createPreviewApp<T>>;
