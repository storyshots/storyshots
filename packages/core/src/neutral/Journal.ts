import stringify from 'safe-stable-stringify';
import { Brand } from '@storyshots/utils';

/**
 * TODO: Eject base journal interface into relevant packages: react, next.js
 * JSON string (with stable sorted object properties) representing journal records
 */
export type Journal = Brand<string, 'JournalRecords'>;

export const Journal = {
  create: (records: unknown): Journal => stringify(records, null, 2) as Journal,
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    createJournal(): Promise<Journal>;
  }
}
