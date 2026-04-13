import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { ScreenshotPath } from '../../../neutral/screenshot/Screenshot';

export async function createScreenshotPath(
  content: Buffer,
): Promise<ScreenshotPath> {
  const hash = createHash('sha256').update(content).digest('hex');
  const imagesDir = path.join(process.cwd(), '.storyshots', 'images');
  const target = path.join(imagesDir, `${hash}.png`);

  await fs.mkdir(imagesDir, { recursive: true });
  await fs.writeFile(target, content);

  return target as ScreenshotPath;
}
