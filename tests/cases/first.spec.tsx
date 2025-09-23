/* eslint-disable react/react-in-jsx-scope */
import { expect, test } from '@playwright/test';
import { wait } from '@lib';

test.describe('My describe', () => {
  test('Hello', async () => {
    await wait(5_000);

    expect(true).toBe(true);
  });

  test('World', async () => {
    await wait(1_000);

    expect(true).toBe(true);
  });
});
