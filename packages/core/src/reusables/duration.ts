import { Brand } from '@core';

// Duration value measured in milliseconds
export type Duration = Brand<number, 'Duration'>;

export type Measured<out T = unknown> = { duration: Duration; data: T };

export const Duration = {
  async measure<T>(task: () => Promise<T>): Promise<Measured<T>> {
    const start = performance.now();

    const data = await task();

    const end = performance.now();

    return { data, duration: (end - start) as Duration };
  },
  zero() {
    return 0 as Duration;
  },
  sum(...durations: Duration[]): Duration {
    return durations.reduce(
      (all, duration) => (all + duration) as Duration,
      Duration.zero(),
    );
  },
  toString(ms: Duration): string {
    if (ms < 1000) {
      return ms.toFixed(0) + 'ms';
    }

    const seconds = ms / 1000;
    if (seconds < 60) {
      return seconds.toFixed(1) + 's';
    }

    const minutes = seconds / 60;
    if (minutes < 60) {
      return minutes.toFixed(1) + 'm';
    }

    const hours = minutes / 60;
    if (hours < 24) {
      return hours.toFixed(1) + 'h';
    }

    const days = hours / 24;

    return days.toFixed(1) + 'd';
  },
};
