import Clock, { FakeTimerInstallOpts } from '@sinonjs/fake-timers';
import MockDate from 'mockdate';

import 'mock-local-storage';

type InstallConfig = {
  date: Date;
  clock?: FakeTimerInstallOpts;
};

/**
 * https://storyshots.github.io/storyshots/modules/web-api#clock
 */
type PageClock = {
  set(date: Date): void;
};

/**
 * https://storyshots.github.io/storyshots/modules/web-api#install
 */
export function install(config: InstallConfig): PageClock {
  MockDate.set(config.date);

  const clock = Clock.install({
    shouldAdvanceTime: true,
    toFake: ['setTimeout', 'clearTimeout'],
    ...config.clock,
  });

  window.tick = (ms) => clock.tick(ms);

  return { set: (date) => MockDate.set(date) };
}

declare global {
  interface Window {
    /**
     * https://storyshots.github.io/storyshots/modules/web-api#tick
     */
    tick(ms: number): void;
  }
}
