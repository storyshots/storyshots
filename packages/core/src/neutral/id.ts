import filenamify from 'filenamify/browser';
import slugify from 'slugify';
import { Brand } from '@storyshots/utils';

/**
 * A unique identifier pointing to a specific story node in a tree.
 *
 * Contains parent-path information, so it is not only unique
 * but also location-aware.
 */
export type StoryID = Brand<FileNameLike, 'StoryID'>;

/**
 * A unique identifier pointing to a specific group node in a tree.
 *
 * Contains parent-path information, so it is not only unique
 * but also location-aware.
 */
export type GroupID = Brand<FileNameLike, 'GroupID'>;

/**
 * Represents a string that can be used as a filename.
 */
type FileNameLike = Brand<string, 'FileName'>;

export const ID = {
  createStoryID: (id: string): StoryID => createID(id) as StoryID,
  createGroupID: (id: string): GroupID => createID(id) as GroupID,
  prepend: <TID extends StoryID | GroupID>(
    parent: GroupID,
    child: TID
  ): TID => `${parent}__${child}` as TID,
};

function createID(id: string): FileNameLike {
  return createURLSafeFilename(id);
}

function createURLSafeFilename(str: string) {
  return slugify(filenamify(str, { replacement: '' }), {
    lower: true,
  }) as FileNameLike;
}
