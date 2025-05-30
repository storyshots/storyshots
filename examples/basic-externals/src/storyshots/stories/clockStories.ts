import { finder, only } from '@storyshots/core';
import { clock } from '../externals/install-clock';
import { describe, it } from '../preview/config';
import { open } from './utils/actors';

export const clockStories = only(
  ['desktop'],
  describe('Clock', [
    it('shows default time', {
      act: open('Clock'),
    }),
    it('shows specified time', {
      arrange: (arrange) => {
        clock.setSystemTime(new Date(2024, 0, 14, 12));

        return arrange;
      },
      act: open('Clock'),
    }),
    it('listens to natural flow of time', {
      arrange: (arrange) => {
        clock.unfreeze();
        
        return arrange;
      },
      act: (actor) =>
        actor.do(open('Clock')).exec(() => window.clock.tick(1_000)),
    }),
    it('allows to select now', {
      act: (actor) =>
        actor
          .do(open('Clock'))
          .click(finder.getByPlaceholder('Select time'))
          .screenshot('Popup')
          .click(finder.getByText('Now')),
    }),
    it('shows message after a while', {
      act: (actor) =>
        actor
          .do(open('Clock'))
          .click(finder.getByText('Show current'))
          .exec(() => window.clock.tick(10_000)),
    }),
  ]),
);
