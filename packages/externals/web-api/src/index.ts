import Clock, {
  FakeTimerInstallOpts,
  InstalledClock,
} from '@sinonjs/fake-timers';

import 'mock-local-storage';

type InstallConfig = FakeTimerInstallOpts;

/**
 * https://storyshots.github.io/storyshots/modules/web-api#clock
 */
type PageClock = InstalledClock;

/**
 * https://storyshots.github.io/storyshots/modules/web-api#install
 */
export function install(config: InstallConfig): PageClock {
  const clock = Clock.install(config);

  window.tick = (ms) => clock.tick(ms);

  return clock;
}

declare global {
  interface Window {
    /**
     * https://storyshots.github.io/storyshots/modules/web-api#tick
     */
    tick(ms: number): void;
  }
}
