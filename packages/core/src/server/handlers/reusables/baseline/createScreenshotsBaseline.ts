import { ScreenshotName } from '@core';
import path from 'path';
import { ScreenshotPath } from '../../../../reusables/types';
import { ManagerConfig } from '../../../types';
import { copy, exists, mkdir, mkfile, read, rmdir } from './utils';
import { RunnableStoryMeta } from '../../../../core/story/runnable-story-meta';

export async function createScreenshotsBaseline(env: ManagerConfig) {
  const { getActualDirFor, actualResultsDir } = await prepareStorage();
  const expectedResultsDir = env.paths.screenshots;

  return {
    createDiff: async (
      meta: RunnableStoryMeta,
      name: ScreenshotName,
      content: Uint8Array,
    ) => {
      const dir = await getActualDirFor(meta);
      const at = path.join(dir, `${meta.story.id}_${name}_diff.png`);

      await mkfile(at, content);

      return at as ScreenshotPath;
    },
    createActualScreenshot: async (
      story: RunnableStoryMeta,
      name: ScreenshotName,
      content: Uint8Array,
    ): Promise<ScreenshotPath> => {
      const dir = await getActualDirFor(story);
      const at = path.join(dir, constructScreenshotFileName(story, name));

      await mkfile(at, content);

      return at as ScreenshotPath;
    },
    getExpectedScreenshot: async (
      story: RunnableStoryMeta,
      name: ScreenshotName,
    ): Promise<ScreenshotPath | undefined> => {
      const file = path.join(
        expectedResultsDir,
        story.device.name,
        constructScreenshotFileName(story, name),
      );

      return (await exists(file)) ? (file as ScreenshotPath) : undefined;
    },
    readScreenshot: (path: ScreenshotPath): Promise<Buffer> => read(path),
    acceptScreenshot: async (temp: ScreenshotPath): Promise<void> => {
      const baseline = temp.replace(actualResultsDir, expectedResultsDir);
      const dir = path.dirname(baseline);

      if (!(await exists(dir))) {
        await mkdir(dir);
      }

      return copy(temp, baseline);
    },
  };

  async function prepareStorage() {
    const actualResultsDir = path.join(env.paths.temp, 'actual');

    if (await exists(actualResultsDir)) {
      await rmdir(actualResultsDir);
    }

    return {
      /**
       * Points to temporal screenshots storage
       */
      actualResultsDir,
      /**
       * Returns reference to the story screenshots storage (which is being cleaned upon initialization)
       *
       * @example getActualDirFor(story) // -> ref to `/temp/actual/desktop` folder
       */
      getActualDirFor: async (story: RunnableStoryMeta) => {
        const dir = path.join(actualResultsDir, story.device.name);

        if (!(await exists(dir))) {
          await mkdir(dir);
        }

        return dir;
      },
    };
  }
}

function constructScreenshotFileName(
  { story: { id } }: RunnableStoryMeta,
  name: ScreenshotName,
): string {
  return `${id}_${name}.png`;
}
