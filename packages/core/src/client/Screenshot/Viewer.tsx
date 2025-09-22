import styled from 'styled-components';

export const Viewer = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0 12px;
    padding: 24px;
    height: 100%;
    background-color: #ececef;
    border: 1px solid #cecece;
    border-radius: 4px;
    box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  `,
  Main: styled.div`
    flex: 1;
    overflow: hidden;
  `,
  Bottom: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  `,
};
