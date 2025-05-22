import { UnknownArrangers } from '../arrangers-types';

/**
 * https://storyshots.github.io/storyshots/modules/arrangers#arrange
 */
export const arrange: UnknownArrangers['arrange'] = (...arrangers) =>
  arrangers.reduce(
    (arrange, curr) => (externals, config) =>
      curr(arrange(externals, config), config),
    (externals) => externals,
  );
