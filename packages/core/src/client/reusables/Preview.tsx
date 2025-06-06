import React, { CSSProperties } from 'react';

type Props = {
  style?: CSSProperties;
};

export const Preview: React.FC<Props> = (props) => (
  <iframe
    id="preview"
    src={location.origin}
    style={{
      display: 'block',
      border: 'none',
      height: '100%',
      width: '100%',
      ...props.style,
    }}
  />
);
