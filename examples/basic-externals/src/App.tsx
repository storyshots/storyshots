import { App as _App, ConfigProvider, ThemeConfig } from 'antd';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { ExternalsProvider } from './externals/Context';
import { IExternals } from './externals/types';
import { TodoApp } from './TodoApp';

type Props = { externals: IExternals; theme?: ThemeConfig };

export const App: React.FC<Props> = (props) => {
  return (
    <_App>
      <ConfigProvider theme={props.theme}>
        <GlobalStyle />
        <ExternalsProvider externals={props.externals}>
          <TodoApp />
        </ExternalsProvider>
      </ConfigProvider>
    </_App>
  );
};

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        background: #f4f6fb;
    }

    body, html, #root, .ant-app {
        height: 100%;
    }

    .todo-app-shell {
        min-height: 100%;
        padding: 16px;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        box-sizing: border-box;
    }

    .todo-card {
        width: 100%;
        max-width: 420px;
        border-radius: 16px;
        box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08);
    }

    .todo-title {
        word-break: break-word;
    }

    .todo-title-completed {
        text-decoration: line-through;
        color: #8c8c8c;
    }

    @media (min-width: 768px) {
        .todo-app-shell {
            padding: 32px 16px;
        }
    }
`;
