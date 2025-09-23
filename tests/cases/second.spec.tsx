/* eslint-disable react/react-in-jsx-scope */
import { expect, test } from '@playwright/test';
import { wait } from '@lib';

test.describe('My another describe', () => {
  test('Wow', async () => {
    await wait(2_000);

    expect(true).toBe(true);
  });

  test('Hey', async () => {
    await wait(5_000);

    expect(true).toBe(true);
  });
});
