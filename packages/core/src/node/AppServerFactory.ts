import { AppArgs } from '../neutral/AppArgs';

export type AppServerFactory = (args: AppArgs) => Promise<AppServer>;

type AppServer = AsyncDisposable & { at: string };
