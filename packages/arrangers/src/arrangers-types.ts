import { StoryConfig } from '@storyshots/core';
import { GetByPath, PathsOf } from './path-types';

export type UnknownArrangers = {
  focus(path: string): UnknownArrangers;
  record(path: string, handler?: UnknownFunction): UnknownArranger;
  transform(path: string, handler: UnknownFunction): UnknownArranger;
  set(path: string, value: unknown): UnknownArranger;
  arrange(...arrangers: UnknownArranger[]): UnknownArranger;
  iterated(
    values: unknown[],
    transform: (next: () => unknown) => UnknownArranger,
  ): UnknownArranger;
  compose(
    path: string,
    transform: (value: unknown, config: StoryConfig) => unknown,
  ): UnknownArranger;
};

export type UnknownArranger = (
  externals: unknown,
  config: StoryConfig,
) => unknown;

export type UnknownFunction = (...args: unknown[]) => unknown;

export type Arrangers<TExternals, TFocus> = {
  arrange(...arrangers: Arranger<TExternals>[]): Arranger<TExternals>;

  iterated<T>(
    values: T[],
    transform: (next: () => T) => Arranger<TExternals>,
  ): Arranger<TExternals>;

  set<TPath extends PathsOf<TFocus>>(
    path: TPath,
    value: GetByPath<TPath, TFocus>,
  ): Arranger<TExternals>;

  transform<TPath extends PathsOf<TFocus>>(
    path: TPath,
    handle: AsyncMap<GetByPath<TPath, TFocus>>,
  ): Arranger<TExternals>;

  record<TPath extends PathsOf<TFocus>>(
    path: TPath,
    handle?: GetByPath<TPath, TFocus>,
  ): Arranger<TExternals>;

  focus<TPath extends PathsOf<TFocus>>(
    path: TPath,
  ): Arrangers<TExternals, GetByPath<TPath, TFocus>>;

  compose<TPath extends PathsOf<TFocus>>(
      path: TPath,
      transform: (
          value: GetByPath<TPath, TFocus>,
          config: StoryConfig,
      ) => GetByPath<TPath, TFocus>,
  ): Arranger<TExternals>;
};

type AsyncMap<T> = T extends (...args: infer P) => Promise<infer R>
  ? (result: R, ...args: P) => R | Promise<R>
  : never;

export type Arranger<TExternals> = (
  externals: TExternals,
  config: StoryConfig,
) => TExternals;
