import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ID } from '../src/neutral/story/id';

describe('ID defines utilities for url/filename safe identifiers', () => {
  it('createStoryID creates kebab case for basic phrase', () => {
    assert.strictEqual(
      ID.createStoryID('Basic Story Name'),
      'basic-story-name',
    );
  });

  it('createStoryID handles specific char cases', () => {
    assert.strictEqual(
      ID.createStoryID('[PROJ-1020]: Button is disabled when form is invalid'),
      'proj-1020-button-is-disabled-when-form-is-invalid',
    );
  });

  it('createStoryID handles cyrillic phrase', () => {
    assert.strictEqual(
      ID.createStoryID('позволяет пользователю войти в свой аккаунт'),
      'pozvolyaet-polzovatelyu-vojti-v-svoj-akkaunt',
    );
  });

  it('prepend creates parent-aware StoryID from GroupID and StoryID', () => {
    const group = ID.createGroupID('Auth flow');
    const story = ID.createStoryID('logins successfully');
    const nestedStory = ID.prepend(group, story);

    assert.strictEqual(nestedStory, 'auth-flow__logins-successfully');
  });
});
