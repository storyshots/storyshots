import { DefinedActiveStory } from './types';
import { assert } from '@lib';

// Represents type safe environment.
// Getters are reading information from global object as well (and only then try to use process.env).
type SafeEnv = {
  // Defines current next app mode
  STORYSHOTS_MODE?: StoryshotsMode;
};

export function getFromENVByKey<T extends keyof SafeEnv>(key: T): SafeEnv[T] {
  const context = globalThis as Record<string, unknown>;

  if (key in context) {
    assert(typeof context[key] === 'string', `Expected ${key} to be a string`);

    return JSON.parse(context[key]);
  }

  return process.env[key] === undefined
    ? undefined
    : JSON.parse(process.env[key]);
}

export function createENVFromKey<T extends keyof SafeEnv>(
  key: T,
  value: SafeEnv[T],
): Record<string, string> {
  if (value === undefined) {
    return {};
  }

  return {
    [key]: JSON.stringify(value),
  };
}

export type StoryshotsMode =
  | PreviewMode
  | StoryMode
  | MasterBuildMode
  | DefaultMode;

/**
 * Denotes preview mode (preview as provider of stories)
 */
export type PreviewMode = { type: 'preview'; dev: boolean };

/**
 * Defined story mode. When app is running under specific story context
 */
export type StoryMode = DefinedActiveStory & {
  type: 'story';
  dev: boolean;
};

/**
 * Defines phase in which app template is compiled
 */
export type MasterBuildMode = {
  type: 'master-build';
};

/**
 * When app is running in default mode
 */
export type DefaultMode = { type: 'default' };
