import { describe, it } from 'node:test';
import { createStoryFactories } from './index';

describe('createStoryFactories creates parent-aware story trees', () => {
  it('handles single it node', (t) => {
    const tree = createStoryFactories().it('single story', {});

    t.assert.snapshot(tree);
  });

  it('handles it node wrapped in describe', (t) => {
    const tree = createStoryFactories().describe(
      'auth',
      createStoryFactories().it('logins successfully', {})
    );

    t.assert.snapshot(tree);
  });

  it('handles it node wrapped in describe wrapped in describe', (t) => {
    const tree = createStoryFactories().describe(
      'auth',
      createStoryFactories().describe(
        'login form',
        createStoryFactories().it('shows submit button', {})
      )
    );

    t.assert.snapshot(tree);
  });
});
