import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ID } from '../src/neutral/id';

describe('ID defines utilities for url/filename safe identifiers', () => {
  it('createStoryID creates kebab case for basic phrase', () => {
    assert.strictEqual(
      ID.createStoryID('Basic Story Name'),
      'basic-story-name'
    );
  });

  it('createStoryID handles invalid filename chars including NUL', () => {
    assert.strictEqual(ID.createStoryID('bad\0name<>:"/\\|?*'), 'badname');
  });

  it('createStoryID handles cyrillic phrase', () => {
    assert.strictEqual(
      ID.createStoryID('позволяет пользователю войти в свой аккаунт'),
      'pozvolyaet-polzovatelyu-vojti-v-svoj-akkaunt'
    );
  });

  it('prepend creates parent-aware StoryID from GroupID and StoryID', () => {
    const group = ID.createGroupID('Auth flow');
    const story = ID.createStoryID('logins successfully');
    const nestedStory = ID.prepend(group, story);

    assert.strictEqual(nestedStory, 'auth-flow__logins-successfully');
  });
});
