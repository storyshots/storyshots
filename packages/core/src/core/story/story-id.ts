import { isNil } from '@lib';
import { Brand, SubBrand } from '../brand';

export type StoryID = SubBrand<FileNameLike, 'StoryID'>;

export type GroupID = SubBrand<FileNameLike, 'GroupID'>;

export function createGroupID(value: string, parent?: GroupID) {
  return join(parent, value) as GroupID;
}

export function createStoryID(value: string, parent?: GroupID) {
  return join(parent, value) as StoryID;
}

export function isStoryChildOfGroup(group: GroupID, story: StoryID) {
  return parseStoryID(story).includes(group);
}

export function parseStoryID(id: StoryID): GroupID[] {
  return id
    .split('__')
    .slice(0, -1)
    .map((_, index, parts) => parts.slice(0, index + 1).join('__') as GroupID);
}

function join(parent: GroupID | undefined, child: string): FileNameLike {
  if (isNil(parent)) {
    return sanitize(child);
  }

  return sanitize(`${parent}__${sanitize(child)}`);
}

function sanitize(value: string) {
  return value.replace(/[^a-z0-9]/gi, '_').toLowerCase() as FileNameLike;
}

type FileNameLike = Brand<string, 'FileName'>;
