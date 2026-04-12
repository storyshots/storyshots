import { describe, it } from 'node:test';
import { createStoryFactories } from '../src/neutral/createStoryFactories';
import { MaterializedStory } from '../src/neutral/MaterializedStory';
import { Device } from '../src/neutral/config';

describe('MaterializedStory', () => {
  it('handles positive materialization result', (t) => {
    const stories = createStoryFactories().it('single materialized story', {
      act: (actor) => actor.wait(1_000),
    });

    const materialized = MaterializedStory.materialize(
      stories,
      createDevices()
    );

    t.assert.snapshot(materialized);
  });

  it('does fail-fast materialization error', (t) => {
    const stories = createStoryFactories().it('single failed story', {
      act: () => {
        throw { message: 'SOMETHING_WENT_WRONG' };
      },
    });

    const materialized = MaterializedStory.materialize(
      stories,
      createDevices()
    );

    t.assert.snapshot(materialized);
  });

  it('skips stories with no actions', (t) => {
    const stories = createStoryFactories().it('single materialized story', {
      act: () => ({ toMeta: () => [] }),
    });

    const materialized = MaterializedStory.materialize(
      stories,
      createDevices()
    );

    t.assert.snapshot(materialized);
  });
});

function createDevices() {
  return [
    Device.create({
      name: 'desktop',
      width: 1280,
      height: 720,
    }),
  ];
}
