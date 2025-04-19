import { Brand } from '../brand';
import { Journal } from './journal/types';

export type StoryConfig = StoryEnvironment & {
  journal: Journal;
};

export type StoryEnvironment = {
  device: Device;
  testing: boolean;
};

export type DeviceName = Brand<string, 'DeviceName'>;

export type Device = DeviceDimensions & {
  name: DeviceName;
  userAgent?: string;
};

export type DeviceDimensions = { width: number; height: number };
