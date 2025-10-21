import { Frame } from 'playwright';

export async function getActualRecords(preview: Frame) {
  return preview.evaluate(() => window.getJournalRecords());
}
