import fs from 'node:fs/promises';
import path from 'node:path';
import { StoryID } from '../../../neutral/story/id';
import { RunContext } from '../utils/RunContext';
import { Journal } from '../../../neutral/Journal';

export const JournalExpectedBaseline = {
  read: async () => {
    const { story } = RunContext.use();

    return (await get())?.[story.id];
  },
  accept: async (records: Journal): Promise<void> => {
    const { story } = RunContext.use();

    const file = createRecordsPath();

    await fs.mkdir(path.dirname(file), { recursive: true });

    const content = { ...(await get()), [story.id]: records };

    await fs.writeFile(file, JSON.stringify(content, null, 2));
  },
};

async function get(): Promise<Record<StoryID, Journal> | undefined> {
  const file = createRecordsPath();

  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }

    throw error;
  }
}

function createRecordsPath(): string {
  const { story, paths } = RunContext.use();

  return path.join(
    paths.journal,
    story.device.name,
    `${story.parents.at(-1)?.id ?? story.id}.json`,
  );
}
