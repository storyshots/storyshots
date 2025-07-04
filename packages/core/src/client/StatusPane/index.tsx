import { flat, StoryID, StoryTree } from '@core';
import { assertNotEmpty } from '@lib';
import convert from 'ansi-to-html';
import { Segmented } from 'antd';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { createSummary } from '../../reusables/summary';
import { ErrorSummary } from '../../reusables/summary/types';
import { UseBehaviourProps } from '../behaviour/types';

export const StatusPaneArea: React.FC<UseBehaviourProps> = (props) => {
  const { selection, results, statusPaneOpen } = props;
  const [errorsAreActive, setErrorsAreActive] = useState(true);

  if (selection.type === 'initializing' || !statusPaneOpen) {
    return null;
  }

  const summary = createSummary(results);
  const errors = enrichErrors(selection.stories);
  const failures = enrichFailures(selection.stories);

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
            <StatusEntry key={index} active$={isSelected(story.id)}>
              <span
                style={{ fontWeight: 'bold' }}
              >{`[${error.device.name}] ${story.title}`}</span>
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
            <StatusEntry
              key={index}
              active$={isSelected(story.id)}
              onClick={() => props.setStory(story.id)}
            >
              <span
                style={{ fontWeight: 'bold' }}
              >{`[${failure.device.name}] ${story.title}`}</span>
            </StatusEntry>
          ))}
        </StatusEntries>
      )}
    </Pane>
  );

  function isSelected(id: StoryID) {
    return selection.type === 'story' && id === selection.story.id;
  }

  function enrichErrors(stories: StoryTree) {
    const errors: ErrorSummary[] =
      selection.type === 'story' &&
      selection.progress.type === 'played' &&
      selection.progress.result.type === 'error'
        ? [
            ...summary.errors,
            {
              id: selection.story.id,
              device: props.device.preview,
              message: selection.progress.result.message,
            },
          ]
        : summary.errors;

    return errors.map((error) => {
      const story = flat(stories).find((it) => it.id === error.id);

      assertNotEmpty(story, 'Errors are invalid. Press F5 to update');

      return { story, error };
    });
  }

  function enrichFailures(stories: StoryTree) {
    return summary.changes
      .filter(
        (it) =>
          it.records?.type === 'fail' ||
          it.screenshots.some((screenshot) => screenshot.type === 'fail'),
      )
      .map((failure) => {
        const story = flat(stories).find((it) => it.id === failure.id);

        assertNotEmpty(story, 'Failures are invalid. Press F5 to update');

        return { story, failure };
      });
  }
};

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

const StatusEntry = styled.li<{ active$: boolean }>`
  padding: 10px;

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
