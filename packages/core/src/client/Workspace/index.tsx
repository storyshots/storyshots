import { Layout as AntdLayout } from 'antd';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

type Props = PropsWithChildren & {
  title?: string;
  actions?: React.ReactNode;
};

export const Workspace: React.FC<Props> = ({ children, actions, title }) => (
  <Layout>
    <TopPanel>
      <Title>{title}</Title>
      <Actions>{actions}</Actions>
    </TopPanel>
    <Content>{children}</Content>
  </Layout>
);

const Layout = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopPanel = styled(AntdLayout.Header)`
  display: flex;
  justify-content: space-between;
  background-color: #fafafa;
  border-bottom: 1px solid #cecece;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #9c9c9c;
`;

const Actions = styled.div`
  margin: 0 2px 0 16px;
`;

const Content = styled.div`
  flex: 1;
  max-height: calc(100vh - 64px);
  background-color: #fff;
  padding: 12px 0;
`;
