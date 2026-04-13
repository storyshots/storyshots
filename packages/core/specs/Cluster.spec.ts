import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Stream } from '@storyshots/utils';
import { Cluster } from '../src/node/runStories/Cluster';
import { Device } from '../src/neutral/story/config';

describe('Cluster schedules jobs on playwright agents pool', () => {
  it('emits values for one agent and three jobs', async () => {
    await using cluster = Cluster.create(1);

    const args = createArgs({ count: 3 });

    const [emits] = await Stream.toPromise(
      cluster.schedule(args, {
        signal: new AbortController().signal,
        handle: async function* (arg) {
          yield arg;
        },
      }),
    );

    assert.deepStrictEqual(emits, args);
  });

  it('emits first job and then rejects on second failed job', async () => {
    await using cluster = Cluster.create(1);

    const args = createArgs({ count: 2 });

    const stream = cluster.schedule(args, {
      signal: new AbortController().signal,
      handle: async function* (arg) {
        if (arg.index === 1) {
          throw new Error('SOMETHING_WENT_WRONG');
        }

        yield arg;
      },
    });

    assert.deepStrictEqual(await stream.next(), {
      done: false,
      value: args[0],
    });

    await assert.rejects(() => stream.next(), /SOMETHING_WENT_WRONG/);
  });

  it('rejects generator when signal is cancelled', async () => {
    await using cluster = Cluster.create(1);

    const args = createArgs({ count: 1 });
    const controller = new AbortController();

    const stream = cluster.schedule(args, {
      signal: controller.signal,
      handle: async function* (arg) {
        yield arg;
      },
    });

    controller.abort();

    await assert.rejects(() => stream.next());
  });
});

function createArgs({ count }: { count: number }) {
  return Array.from({ length: count }, (_, index) => ({
    index,
    device: Device.create({
      name: 'desktop',
      width: 1280,
      height: 720,
    }),
  }));
}
