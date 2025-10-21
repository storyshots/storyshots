import { Actor, MetaActionsFactory } from '../actor/types';
import { Device, StoryEnvironment } from '../story-config';
import { GroupID, StoryID } from '../story-id';

export type StoryTree = Group | Story | StoryTree[];

export type Group = {
  id: GroupID;
  type: 'group';
  title: string;
  children: StoryTree;
};

export interface Story extends StoryPayload, StoryMeta {}

export interface StoryPayload {
  /**
   * https://storyshots.github.io/storyshots/API/factories/it#retries
   */
  retries(device: Device): number;

  /**
   * https://storyshots.github.io/storyshots/API/factories/it#act
   */
  act(actor: Actor, config: StoryEnvironment): MetaActionsFactory;
}

type StoryMeta = {
  id: StoryID;
  type: 'story';
  title: string;
  // Parent titles, used for pretty printing
  parents: string[];
};
