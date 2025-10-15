import styled, { css } from 'styled-components';
import { EntryActions } from './EntryActions';
import { EntryDuration } from './EntryDuration';

type Props = {
  $level: number;
  $offset: number;
};

export const EntryHeader = styled.div<Props>`
  cursor: pointer;
  height: 25px;
  display: flex;
  align-items: center;
  padding-right: 2px;
  padding-left: ${(props) => `${props.$level * 24 + props.$offset}px`};

  ${EntryActions} {
    display: none;
  }
    
  ${EntryDuration} {
    display: inherit;
  }

  &:hover,
  &:focus {
    ${EntryActions} {
      display: inherit;
    }
    
    ${EntryDuration} {
      display: none;
    }
  }
`;

/*
 TODO: Rewrite EntryHeader
  It should have title, left and right actions
  and also elements that are visible when hovered and elements visible on blur.
*/
export const ActiveEntryHeader = styled(EntryHeader)<{
  $active: boolean;
  $color: string;
}>`
  background: ${({ $active, $color }) => ($active ? $color : 'none')};

  ${({ $active }) =>
    !$active &&
    css`
      &:hover,
      &:focus {
        background: #fafafa;
      }
    `};
`;
