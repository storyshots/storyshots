import { EyeOutlined, SlidersOutlined } from '@ant-design/icons';
import { Device, StoryTree } from '@core';
import { assert } from '@lib';
import { Form, Select } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { UseBehaviourProps } from '../../behaviour/types';
import { ReadySelection } from '../../behaviour/useSelection/types';
import { EntryAction } from '../reusables/EntryAction';
import { RunAction } from '../reusables/RunAction';
import { EntryActions, IdleActions } from './EntryActions';
import { EntryHeader } from './EntryHeader';
import { StopAction } from './StopAction';
import { OverallStatus } from './OverallStatus';

export type Props = UseBehaviourProps & {
  stories: StoryTree;
  selection: ReadySelection;
};

export const TopBar: React.FC<Props> = (props) => {
  const [opened, setOpened] = useState(false);

  return (
    <div aria-label="Status">
      <EntryHeader>
        <OverallStatus
          toggleStatusPane={props.toggleStatusPane}
          results={props.results}
        />
        <EntryActions>
          <StopAction stop={props.stop} results={props.results} />
          <IdleActions results={props.results}>
            <RunAction stories={props.stories} run={props.run} />
            <PickLocatorAction onPick={props.toggleHighlighting} />
            <ToggleConfigPaneAction
              onToggle={() => setOpened((prev) => !prev)}
            />
          </IdleActions>
        </EntryActions>
      </EntryHeader>
      {opened && (
        <PreviewConfigForm layout="vertical" size="small">
          <Form.Item label="Devices to run" htmlFor="runnable-devices-selector">
            <Select<DeviceOption['value'][], DeviceOption>
              id="runnable-devices-selector"
              mode="multiple"
              value={props.runnables.selected.map((it) => it.name)}
              onChange={(_, options) => {
                assert(Array.isArray(options));

                props.runnables.set(options.map((it) => it.device));
              }}
              options={props.devices.map((it) => ({
                value: it.name,
                label: it.name,
                device: it,
              }))}
              placeholder={
                <p style={{ fontStyle: 'italic' }}>Default device</p>
              }
              showSearch={false}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="Device to emulate"
            htmlFor="emulate-device-selector"
          >
            <Select<DeviceOption['value'], DeviceOption>
              id="emulate-device-selector"
              value={props.preview.emulate?.name}
              placeholder={<p style={{ fontStyle: 'italic' }}>No emulation</p>}
              // undefined is important here (when clear pressed)
              onChange={(
                _,
                option: DeviceOption | DeviceOption[] | undefined,
              ) => {
                assert(!Array.isArray(option));

                props.preview.set(option?.device);
              }}
              options={props.devices.map((it) => ({
                value: it.name,
                label: it.name,
                device: it,
              }))}
              allowClear
            />
          </Form.Item>
        </PreviewConfigForm>
      )}
    </div>
  );
};

const PickLocatorAction: React.FC<{ onPick(): void }> = ({ onPick }) => (
  <EntryAction label="Pick locator" icon={<EyeOutlined />} action={onPick} />
);

const ToggleConfigPaneAction: React.FC<{ onToggle(): void }> = ({
  onToggle,
}) => (
  <EntryAction
    label="Toggle config pane"
    icon={<SlidersOutlined />}
    action={onToggle}
  />
);

type DeviceOption = {
  value: Device['name'];
  label: string;
  device: Device;
};

const PreviewConfigForm = styled(Form)`
  background-color: #f7f7f7;
  padding: 8px;
  border-bottom: 1px solid rgb(206, 206, 206);

  .ant-form-item {
    margin-bottom: 10px;
  }
`;
