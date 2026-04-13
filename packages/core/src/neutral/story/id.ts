import { Brand } from '@storyshots/utils';
import { Filename } from './Filename';

/**
 * A unique identifier pointing to a specific story node in a tree.
 *
 * Contains parent-path information, so it is not only unique
 * but also location-aware.
 */
export type StoryID = Brand<Filename, 'StoryID'>;

/**
 * A unique identifier pointing to a specific group node in a tree.
 *
 * Contains parent-path information, so it is not only unique
 * but also location-aware.
 */
export type GroupID = Brand<Filename, 'GroupID'>;

export const ID = {
  createStoryID: (id: string): StoryID => Filename.create(id) as StoryID,
  createGroupID: (id: string): GroupID => Filename.create(id) as GroupID,
  prepend: <TID extends StoryID | GroupID>(parent: GroupID, child: TID): TID =>
    `${parent}__${child}` as TID,
};
