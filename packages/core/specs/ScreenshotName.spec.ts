import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ScreenshotName } from '../src/neutral/screenshot/ScreenshotName';

describe('ScreenshotName validates screenshot names', () => {
  it('throws for invalid name', () => {
    assert.throws(() => ScreenshotName.create('Screenshot name', []));
  });

  it('accepts ScreenshotName', () => {
    assert.strictEqual(
      ScreenshotName.create('ScreenshotName', []),
      'ScreenshotName'
    );
  });

  it('accepts DONE', () => {
    assert.strictEqual(ScreenshotName.create('DONE', []), 'DONE');
  });

  it('accepts Screenshot_Name', () => {
    assert.strictEqual(
      ScreenshotName.create('Screenshot_Name', []),
      'Screenshot_Name'
    );
  });
});
