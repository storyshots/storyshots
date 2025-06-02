import Clock from '@sinonjs/fake-timers';
import MockDate from 'mockdate';

import 'mock-local-storage';

type InstallConfig = {
  now: Date;
};

/**
 * https://storyshots.github.io/storyshots/modules/web-api#clock
 */
type PageClock = {
  /**
   * https://storyshots.github.io/storyshots/modules/web-api#tick
   */
  tick(ms: number): void;
  /**
   * https://storyshots.github.io/storyshots/modules/web-api#setsystemtime
   */
  setSystemTime(date: Date): void;
  /**
   * https://storyshots.github.io/storyshots/modules/web-api#unfreeze
   */
  unfreeze(): void;
};

/**
 * https://storyshots.github.io/storyshots/modules/web-api#install
 */
export function install(config: InstallConfig): PageClock {
  const clock = Clock.install({
    shouldAdvanceTime: true,
    toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'],
  });

  MockDate.set(config.now);

  window.clock = {
    tick: (ms) => clock.tick(ms),
    setSystemTime: (now) => MockDate.set(now),
    unfreeze: () => setInterval(() => MockDate.set(Date.now() + 20), 20),
  };

  return window.clock;
}

declare global {
  interface Window {
    /**
     * https://storyshots.github.io/storyshots/modules/web-api#clock
     */
    clock: PageClock;
  }
}
