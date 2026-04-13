import { describe, it } from 'node:test';
import { createStoryFactories } from '../src/neutral/story/createStoryFactories';
import { MaterializedStory } from '../src/neutral/story/MaterializedStory';
import { Device } from '../src/neutral/story/config';

describe('MaterializedStory converts stories to serializable objects', () => {
  it('does fail-fast materialization error', (t) => {
    const { it } = createStoryFactories();

    const stories = [
      it('failing story', {
        act: () => {
          throw { message: 'SOMETHING_WENT_WRONG' };
        },
      }),
      it('single story', {}),
    ];

    const materialized = MaterializedStory.materialize(stories, [
      Device.create({
        name: 'desktop',
        width: 1280,
        height: 720,
      }),
    ]);

    t.assert.snapshot(materialized);
  });
});
