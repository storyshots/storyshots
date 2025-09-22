import { createActor, Device, flat, Story, StoryEnvironment } from '@core';
import { IWebDriver } from '../../../types';
import { driver } from '../../driver';
import { RunConfig } from '../types';

export function createTests(config: RunConfig): Test[] {
  return flat(config.stories)
    .flatMap((story) =>
      config.on.map((device) => {
        const env: StoryEnvironment = {
          testing: true,
          device,
        };

        return {
          story,
          device,
          actions: story.act(createActor(env), env).__toMeta(),
        };
      }),
    )
    .filter(({ actions }) => actions.length > 0)
    .map(({ story, device, actions }) => ({
      story,
      device,
      run: () =>
        driver.test(story, { ...device, ...story.resize(device) }, actions),
    }));
}

export type Test = {
  story: Story;
  device: Device;
  run(): ReturnType<IWebDriver['test']>;
};
