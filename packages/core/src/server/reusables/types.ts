import { ActionMeta, Device, Story } from '@core';

/**
 * Represents ready to run, unfolded, json-like story with concrete device and actions
 */
export type StoryRunMeta = {
  story: ShallowOmitFunctions<Story>;
  device: Device;
  actions: ActionMeta[];
};

/**
 * Disallows usage of act, arrange etc. functions because they are not available on node env.
 *
 * Omits only functions appearing on first level of a record for simplicity.
 */
type ShallowOmitFunctions<T> = {
  [TKey in keyof T as T[TKey] extends (...args: never[]) => unknown
    ? never
    : TKey]: T[TKey];
};
