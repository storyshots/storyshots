import { Layout as AntdLayout, theme } from 'antd';
import React from 'react';

export function Layout(props: React.PropsWithChildren) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {props.children}
    </div>
  );
}

Layout.Top = Top;
Layout.Sider = Sider;
Layout.Bottom = Bottom;
Layout.Main = Main;

function Top(props: React.PropsWithChildren) {
  return (
    <AntdLayout hasSider style={{ flex: 1 }}>
      {props.children}
    </AntdLayout>
  );
}

function Bottom(props: React.PropsWithChildren) {
  return props.children;
}

function Sider(props: React.PropsWithChildren) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <AntdLayout.Sider
      width={250}
      style={{
        background: colorBgContainer,
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRight: '1px solid #cecece',
      }}
    >
      {props.children}
    </AntdLayout.Sider>
  );
}

function Main(props: React.PropsWithChildren) {
  return (
    <main
      style={{
        width: '100%',
        backgroundColor: 'white',
      }}
    >
      {props.children}
    </main>
  );
}
