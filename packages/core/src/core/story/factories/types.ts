import { Actor, MetaActionsFactory } from '../actor/types';
import {
  Device,
  DeviceDimensions,
  StoryConfig,
  StoryEnvironment,
} from '../story-config';
import { GroupID, StoryID } from '../story-id';
import { StoryTree } from '../types';

interface StoryMeta {
  id: StoryID;
  type: 'story';
  title: string;
}

export interface StoryPayload<TExternals> {
  resize(device: Device): DeviceDimensions;

  retries(device: Device): number;

  arrange(externals: TExternals, config: StoryConfig): TExternals;

  act(actor: Actor, config: StoryEnvironment): MetaActionsFactory;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface StoryAttributes<TExternals> {}

export interface Story<TExternals = unknown>
  extends StoryPayload<TExternals>,
    StoryAttributes<TExternals>,
    StoryMeta {}

export type Group<TExternals = unknown> = {
  id: GroupID;
  type: 'group';
  title: string;
  children: StoryTree<TExternals>;
};
