import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import styled from 'styled-components';
import React from 'react';

export function Spinner() {
  return (
    <Container>
      <Spin indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
`;
