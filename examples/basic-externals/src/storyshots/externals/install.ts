import { Arranger } from '@storyshots/arrangers';
import { install } from '@storyshots/web-api-externals';
import { IExternals } from '../../externals/types';

// 13.01.2024
const _clock = install({
  now: new Date(2024, 0, 13, 12),
  shouldAdvanceTime: false,
  toFake: ['setTimeout', 'Date'],
});

export const withNowAs =
  (date: Date): Arranger<IExternals> =>
  (arranger) => {
    _clock.setSystemTime(date);

    return arranger;
  };
