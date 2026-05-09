import { it } from '../preview/config';
import { finder } from '@storyshots/core';

export const stories = [
  it('renders initial empty state', {}),
  it('adds a todo item', {
    act: (actor) =>
      actor
        .fill(finder.getByPlaceholder('Add a todo'), 'Buy milk')
        .click(finder.getByRole('button', { name: 'Add' })),
  }),
  it('marks todo as completed', {
    act: (actor) =>
      actor
        .fill(finder.getByPlaceholder('Add a todo'), 'Walk dog')
        .click(finder.getByRole('button', { name: 'Add' }))
        .click(finder.getByRole('checkbox', { name: 'Walk dog' })),
  }),
  it('removes a todo item', {
    act: (actor) =>
      actor
        .fill(finder.getByPlaceholder('Add a todo'), 'Read book')
        .click(finder.getByRole('button', { name: 'Add' }))
        .click(finder.getByRole('button', { name: 'Remove' })),
  }),
  it('searches todos', {
    act: (actor) =>
      actor
        .fill(finder.getByPlaceholder('Add a todo'), 'Buy milk')
        .click(finder.getByRole('button', { name: 'Add' }))
        .fill(finder.getByPlaceholder('Add a todo'), 'Walk dog')
        .click(finder.getByRole('button', { name: 'Add' }))
        .fill(finder.getByPlaceholder('Search todos'), 'walk'),
  }),
];
