import React from 'react';
import styled from 'styled-components';
import { green } from '@ant-design/colors';
import { LoadingOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { ActionButton } from '../ActionButton';
import { Props } from './types';

export const Actions: React.FC<Props> = ({
  selection,
  story,
  results,
  run,
}) => {
  const comparison = results.get(story.id);

  if (comparison && comparison.running) {
    return renderWaiting();
  }

  if (selection.type !== 'story' || selection.story.id !== story.id) {
    return renderServerAction();
  }

  if (selection.playing) {
    return renderWaiting();
  }

  return renderServerAction();

  function renderWaiting() {
    return (
      <div>
        <ActionButton icon={<LoadingOutlined style={{ fontSize: 16 }} />} />
      </div>
    );
  }

  function renderServerAction() {
    return (
      <ServerActionStyled>
        <ActionButton
          action={(e) => {
            e.stopPropagation();

            run([story]);
          }}
          icon={
            <PlayCircleOutlined style={{ color: green[6], fontSize: 16 }} />
          }
        />
      </ServerActionStyled>
    );
  }
};

const ServerActionStyled = styled.div`
  transition: opacity 0.2s;
  opacity: 0;

  &:hover {
    opacity: 1;
  }
`;
