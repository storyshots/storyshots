import React from 'react';
import styled, { css } from 'styled-components';
import { GroupEntry } from './GroupEntry';
import { StoryEntry } from './StoryEntry/StoryEntry';
import { Props } from './types';

export const MenuHavingStories: React.FC<Props> = (props) => {
  if (Array.isArray(props.stories)) {
    return (
      <Entries $level={props.level}>
        {props.stories.map((it, index) => (
          <MenuHavingStories key={index} {...props} stories={it} />
        ))}
      </Entries>
    );
  }

  const node = props.stories;

  switch (node.type) {
    case 'group':
      return <GroupEntry key={node.id} {...props} group={node} />;
    case 'story':
      return <StoryEntry key={node.id} {...props} story={node} />;
  }
};

const Entries = styled.ul<{ $level: number }>`
  margin: 0;
  padding: 0;
  list-style-type: none;

  ${(props) =>
    props.$level === 0 &&
    css`
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    `}
`;
