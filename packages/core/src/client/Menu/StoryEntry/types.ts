import { Story } from '@core';
import { Props as ParentProps } from '../types';

export type Props = ParentProps & {
  story: Story;
};
