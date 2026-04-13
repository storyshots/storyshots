import fs from 'node:fs/promises';
import path from 'node:path';
import {
  Screenshot,
  ScreenshotPath,
} from '../../../neutral/screenshot/Screenshot';
import { RunContext } from '../utils/RunContext';

export const ScreenshotsExpectedBaseline = {
  read: async (): Promise<Screenshot[]> => {
    const { story } = RunContext.use();

    const screenshots: Screenshot[] = [];

    for (const action of story.actions) {
      if (action.action !== 'screenshot') {
        continue;
      }

      const screenshot = await createScreenshotPath(action.payload.name);

      if (await exists(screenshot)) {
        screenshots.push({
          name: action.payload.name,
          path: screenshot as ScreenshotPath,
        });
      }
    }

    return screenshots;
  },
  accept: async (screenshots: Screenshot[]): Promise<void> => {
    if (screenshots.length === 0) {
      return;
    }

    for (const screenshot of screenshots) {
      const target = await createScreenshotPath(screenshot.name);

      await fs.rename(screenshot.path, target);
    }
  },
};

async function createScreenshotPath(name: string): Promise<string> {
  const { story, paths } = RunContext.use();
  const dir = path.join(paths.screenshots, story.device.name);

  await fs.mkdir(dir, { recursive: true });

  return path.join(dir, `${story.id}_${name}.png`);
}

async function exists(path: string): Promise<boolean> {
  try {
    await fs.access(path);

    return true;
  } catch {
    return false;
  }
}
