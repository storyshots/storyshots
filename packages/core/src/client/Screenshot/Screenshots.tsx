import styled from 'styled-components';
import React from 'react';
import { ScreenshotPath } from '../../reusables/types';
import { driver } from '../../reusables/runner/driver';

type Props = {
  items: Array<{
    color: string;
    path: ScreenshotPath;
  }>;
};

export const Screenshots: React.FC<Props> = ({ items }) => (
  <Centered>
    {items.map(({ path, color }) => (
      <div style={{ height: '100%', display: 'flex' }}>
        <img
          src={driver.createImgSrc(path)}
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            margin: 'auto',
            pointerEvents: 'none',
            border: `1px solid ${color}`,
          }}
        />
      </div>
    ))}
  </Centered>
);

const Centered = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;
