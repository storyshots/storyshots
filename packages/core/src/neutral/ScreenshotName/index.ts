import { assert, Brand, isNil } from '@storyshots/utils';
import { ActionMeta } from '../createActor/types';

/**
 * Unique (up to story) screenshot name in UpperCamelCase format
 */
export type ScreenshotName = Brand<string, 'ScreenshotName'>;

export const ScreenshotName = {
  create: (name: string, meta: ActionMeta[]): ScreenshotName => {
    assert(
      SCREENSHOT_NAME_RE.test(name),
      `Screenshot named as "${name}" must be in PascalCase format`
    );

    const duplicate = meta.find(
      (it) => it.action === 'screenshot' && it.payload.name === name
    );

    assert(isNil(duplicate), `Found duplicate screenshot "${name}"`);

    return name as ScreenshotName;
  },
};

const SCREENSHOT_NAME_RE = /^[A-Z][A-Za-z0-9_]*$/;
