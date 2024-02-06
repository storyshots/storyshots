import React from 'react';
import styled from 'styled-components';
import ReactDiffViewer, {
  ReactDiffViewerProps,
} from 'react-diff-viewer-continued';

type Props = ReactDiffViewerProps & {
  single?: boolean;
};

export const DiffReader: React.FC<Props> = (props) => {
  function renderViewer() {
    if (props.single) {
      return (
        <WithoutFirstGutter>
          <ReactDiffViewer {...props} />
        </WithoutFirstGutter>
      );
    }

    return <ReactDiffViewer {...props} />;
  }

  return <ReaderPanel>{renderViewer()}</ReaderPanel>;
};

const ReaderPanel = styled.div`
  margin: 0 auto;
  overflow: auto;
  width: calc(100% - 24px);
  border: 1px solid #cecece;
  border-radius: 4px;
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
`;

const WithoutFirstGutter = styled.div`
  & > table > tbody > tr > td:first-of-type {
    display: none;
  }
`;
