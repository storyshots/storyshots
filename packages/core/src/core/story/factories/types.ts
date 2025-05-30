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
  /**
   * https://storyshots.github.io/storyshots/API/factories/it#resize
   */
  resize(device: Device): DeviceDimensions;

  /**
   * https://storyshots.github.io/storyshots/API/factories/it#retries
   */
  retries(device: Device): number;

  /**
   * https://storyshots.github.io/storyshots/API/factories/it#arrange
   */
  arrange(externals: TExternals, config: StoryConfig): TExternals;

  /**
   * https://storyshots.github.io/storyshots/API/factories/it#act
   */
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
