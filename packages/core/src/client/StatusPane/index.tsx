import { Device, flat, Story, StoryID, StoryTree } from '@core';
import { assertNotEmpty, isDefined } from '@lib';
import convert from 'ansi-to-html';
import { Segmented } from 'antd';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { UseBehaviourProps } from '../behaviour/types';

import { UIStoryRunState } from '../behaviour/useRun/types';

import { StoryRunResult } from '../../reusables/runner/StoryRunResult';

export const StatusPaneArea: React.FC<UseBehaviourProps> = (props) => {
  const { selection, statusPaneOpen } = props;
  const [errorsAreActive, setErrorsAreActive] = useState(true);

  if (selection.type === 'initializing' || !statusPaneOpen) {
    return null;
  }

  const errors = toErrors(props, selection.stories);
  const failures = toFailures(props, selection.stories);

  return (
    <Pane>
      <Header>
        <span style={{ lineHeight: 1 }}>Status:</span>
        <TabPanes
          value={errorsAreActive ? 'errors' : 'failures'}
          onChange={(it) => setErrorsAreActive(it === 'errors')}
          options={[
            {
              value: 'errors',
              label: (
                <span>
                  Errors{' '}
                  <span style={{ color: 'rgb(0 0 0 / 50%)' }}>
                    {errors.length}
                  </span>
                </span>
              ),
            },
            {
              value: 'failures',
              label: (
                <span>
                  Failures{' '}
                  <span style={{ color: 'rgb(0 0 0 / 50%)' }}>
                    {failures.length}
                  </span>
                </span>
              ),
            },
          ]}
        />
      </Header>
      {errorsAreActive ? (
        <StatusEntries aria-label="Errors">
          {errors.map(({ story, error }, index) => (
            <StatusEntry key={index}>
              <span style={{ fontWeight: 'bold' }}>
                {toReadableName(story, error.device)}
              </span>
              <div
                style={{ margin: 0 }}
                dangerouslySetInnerHTML={{
                  __html: new convert({
                    escapeXML: true,
                    newline: true,
                  }).toHtml(error.message),
                }}
              />
            </StatusEntry>
          ))}
        </StatusEntries>
      ) : (
        <StatusEntries aria-label="Failures">
          {failures.map(({ story, failure }, index) => (
            <ClickableStatusEntry
              key={index}
              active$={isSelected(story.id)}
              onClick={() => props.setStory(story.id)}
            >
              <span style={{ fontWeight: 'bold' }}>
                {toReadableName(story, failure.device)}
              </span>
            </ClickableStatusEntry>
          ))}
        </StatusEntries>
      )}
    </Pane>
  );

  function isSelected(id: StoryID) {
    return selection.type === 'story' && id === selection.story.id;
  }
};

function toErrors(
  { selection, results, preview }: UseBehaviourProps,
  stories: StoryTree,
) {
  const errors = results
    .all()
    .map((story) =>
      UIStoryRunState.when(story.state, {
        onError: (error) => ({
          id: story.id,
          device: story.device,
          message: error.message,
        }),
        otherwise: () => undefined,
      }),
    )
    .filter(isDefined);

  if (
    selection.type === 'story' &&
    selection.progress.type === 'played' &&
    selection.progress.details.type === 'error'
  ) {
    errors.push({
      id: selection.story.id,
      device: preview.resolved,
      message: `(FROM PLAY) ${selection.progress.details.message}`,
    });
  }

  return errors.map((error) => {
    const story = flat(stories).find((it) => it.id === error.id);

    assertNotEmpty(story, 'Errors are invalid. Press F5 to update');

    return { story, error };
  });
}

function toFailures({ results }: UseBehaviourProps, stories: StoryTree) {
  const failures = results.all().filter((story) =>
    UIStoryRunState.when(story.state, {
      onDone: (details) =>
        StoryRunResult.when(details, {
          onFail: () => true,
          otherwise: () => false,
        }),
      otherwise: () => undefined,
    }),
  );

  return failures.map((failure) => {
    const story = flat(stories).find((it) => it.id === failure.id);

    assertNotEmpty(story, 'Failures are invalid. Press F5 to update');

    return { story, failure };
  });
}

function toReadableName(story: Story, device: Device) {
  return `[${device.name}] ${[...story.parents, story.title].join(' > ')}`;
}

const Pane = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgb(206, 206, 206);
  height: 30vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding-left: 8px;
  height: 30px;
  border-bottom: 1px solid rgb(206, 206, 206);
`;

const TabPanes = styled(Segmented)`
  margin: 0 10px;
  border-radius: 0;
  padding: 0;

  .ant-segmented-item-selected {
    border-radius: 0;
    box-shadow: none;
  }
`;

const StatusEntries = styled.ul`
  overflow: auto;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const StatusEntry = styled.li`
  padding: 10px;
`;

const ClickableStatusEntry = styled(StatusEntry)<{ active$: boolean }>`
  ${(props) =>
    props.active$ &&
    css`
      background-color: #e6f4ff;
    `}

  ${(props) =>
    !props.active$ &&
    css`
      cursor: pointer;

      &:hover {
        background-color: #fafafa;
      }
    `}
`;
