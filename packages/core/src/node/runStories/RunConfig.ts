import { StoryshotsConfig } from '../StoryshotsConfig';

export type RunConfig = StoryshotsConfig & {
  retryOnError?: true;
  signal: AbortSignal;
};
