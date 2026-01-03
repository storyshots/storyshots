import React, { CSSProperties } from 'react';
import { useTypedQSPRoxy } from '../behaviour/useTypedQSPRoxy';

type Props = {
  style?: CSSProperties;
};

export const Preview: React.FC<Props> = (props) => {
  const qs = useTypedQSPRoxy();

  return (
    <iframe
      id="preview"
      src={qs.get('at')}
      style={{
        display: 'block',
        border: 'none',
        height: '100%',
        width: '100%',
        ...props.style,
      }}
    />
  );
};
