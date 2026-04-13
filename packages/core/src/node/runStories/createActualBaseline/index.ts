import { Either, notImplemented } from '@storyshots/utils';
import { Screenshot } from '../../../neutral/screenshot/Screenshot';
import { Journal } from '../../../neutral/Journal';

export type ActualBaseline = {
  journal: Journal;
  screenshots: Screenshot[];
};

export function createActualBaseline(): Promise<
  Either<string, ActualBaseline>
> {
  notImplemented();
}
