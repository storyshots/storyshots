import { RunMode } from '../neutral/RunMode';

export type AppServerFactory = (state: RunMode) => Promise<AppServer>;

type AppServer = AsyncDisposable & { at: string };
