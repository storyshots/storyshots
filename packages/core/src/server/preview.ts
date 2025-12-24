import { ManagerConfig, PreviewServerFactory } from './types';

export const tap =
  (effect: (config: ManagerConfig) => Promise<void>): PreviewServerFactory =>
  async (config) => {
    await effect(config);

    return {
      handler: (_, __, next) => next(),
    };
  };

export const merge = (
  ...handlers: PreviewServerFactory[]
): PreviewServerFactory => handlers.reduce(mergeTwo);

const mergeTwo =
  (
    _left: PreviewServerFactory,
    _right: PreviewServerFactory,
  ): PreviewServerFactory =>
  async (config) => {
    const left = await _left(config);
    const right = await _right(config);

    return {
      handler: (req, res, next) =>
        left.handler(req, res, () => right.handler(req, res, next)),
      cleanup: async () => {
        await left.cleanup?.();
        await right.cleanup?.();
      },
    };
  };
