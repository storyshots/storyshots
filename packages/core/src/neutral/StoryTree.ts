import { Device, StoryEnvironment } from './config';
import { Actor, MetaActionsFactory } from './createActor/types';
import { GroupID, StoryID } from './id';

export type StoryTree<TArg = unknown> =
  | Group<TArg>
  | Story<TArg>
  | StoryTree<TArg>[];

export type Group<TArg = unknown> = GroupMeta & {
  type: 'group';
  children: StoryTree<TArg>;
};

export type GroupMeta = {
  id: GroupID;
  title: string;
};

export type Story<TArg = unknown> = StoryAttributes<TArg> &
  StoryPayload &
  StoryMeta & {
    type: 'story';
  };

export type StoryMeta = {
  id: StoryID;
  title: string;
  /**
   * Chain of parents to whom this story belongs.
   *
   * @example
   *
   * parent_0 -> parent_1 -> story === parents: [parent_0, parent_1]
   */
  parents: GroupMeta[];
};

export type StoryPayload = {
  /**
   * https://storyshots.github.io/storyshots/API/factories/it#retries
   */
  retries(device: Device): number;
  /**
   * https://storyshots.github.io/storyshots/API/factories/it#act
   */
  act(actor: Actor, config: StoryEnvironment): MetaActionsFactory;
};

/**
 * Interface used for ambient extensions of a story object
 */
// Must be interface to support declaration merging
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface StoryAttributes<TArg> {
  __arg?: TArg;
}
