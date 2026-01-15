import { Layout as AntdLayout, theme } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

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

// TODO: Refactor
const ResizingContext = React.createContext<
  | {
      resizing: boolean;
      setResizing(value: boolean): void;
    }
  | undefined
>(undefined);

function Top(props: React.PropsWithChildren) {
  const [resizing, setResizing] = useState(false);

  return (
    <AntdLayout hasSider style={{ flex: 1 }}>
      <ResizingContext.Provider value={{ resizing, setResizing }}>
        {props.children}
      </ResizingContext.Provider>
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

  const [width, setWidth] = useState(250);
  const { resizing, setResizing } = useContext(ResizingContext)!;

  useEffect(() => {
    const resize = (mouse: MouseEvent) => {
      if (resizing) {
        setWidth(mouse.clientX);
      }
    };

    const cancel = () => setResizing(false);

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', cancel);

    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', cancel);
    };
  }, [resizing]);

  return (
    <aside
      style={{
        position: 'relative',
        background: colorBgContainer,
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRight: '1px solid #cecece',
        flexShrink: 0,
        width,
        minWidth: 250,
      }}
    >
      <Slider
        onMouseDown={(event) => {
          event.preventDefault();

          setResizing(true);
        }}
      />
      {props.children}
    </aside>
  );
}

function Main(props: React.PropsWithChildren) {
  const { resizing } = useContext(ResizingContext)!;

  return (
    <main
      style={{
        width: '100%',
        backgroundColor: 'white',
        position: 'relative',
      }}
    >
      {resizing && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
          }}
        />
      )}
      {props.children}
    </main>
  );
}

const Slider = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  transition: background-color 0.2s;
  background: transparent;

  &:active {
    background: rgba(24, 144, 255, 0.47);
  }

  &:hover {
    background: #1890ff33;
  }
`;
