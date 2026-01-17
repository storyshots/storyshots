import { chromium } from 'playwright';
import { asLocator } from 'playwright-core/lib/utils';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto('https://www.google.com/');

await page._snapshotForAI();

const { resolvedSelector } = await page.locator(`aria-ref=e10`)._resolveSelector();

console.log(asLocator('javascript', resolvedSelector));

await browser.close();
