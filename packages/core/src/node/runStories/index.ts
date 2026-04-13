import { Stream } from '@storyshots/utils';
import { MaterializedStory } from '../../neutral/story/MaterializedStory';
import { RunEvent } from '../../neutral/run-event/RunEvent';
import { Cluster } from './Cluster';
import { RunConfig } from './RunConfig';
import { RunContext } from './utils/RunContext';
import { runStory } from './runStory';

export async function* runStories(
  stories: MaterializedStory[],
  config: RunConfig,
): Stream<RunEvent, void> {
  await using cluster = Cluster.create(config.agentsCount);

  yield* cluster.schedule(stories, {
    handle: (story, page) =>
      RunContext.wrap({ ...config, story, page }, runStory),
    signal: config.signal,
  });
}
