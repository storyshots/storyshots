import { Brand } from '@storyshots/utils';
import slugify from 'slugify';
import sanitize from 'sanitize-filename';

/**
 * Represents a string that can be used as a filename.
 */
export type Filename = Brand<string, 'Filename'>;

export const Filename = {
  create: (str: string) =>
    slugify(sanitize(str), {
      lower: true,
    }) as Filename,
};
