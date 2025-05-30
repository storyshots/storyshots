import Clock, {
  FakeTimerInstallOpts,
  InstalledClock,
} from '@sinonjs/fake-timers';

import 'mock-local-storage';

type InstallConfig = Pick<FakeTimerInstallOpts, 'now'>;

/**
 * https://storyshots.github.io/storyshots/modules/web-api#clock
 */
type PageClock = Pick<InstalledClock, 'tick' | 'setSystemTime'>;

/**
 * https://storyshots.github.io/storyshots/modules/web-api#install
 */
export function install(config: InstallConfig): PageClock {
  const clock = Clock.install({ ...config, shouldAdvanceTime: true });

  window.clock = clock;

  return clock;
}

declare global {
  interface Window {
    /**
     * https://storyshots.github.io/storyshots/modules/web-api#tick
     */
    clock: PageClock;
  }
}
