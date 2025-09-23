import { Button, ButtonProps } from 'antd';
import React from 'react';

type Props = ButtonProps & {
  label: string;
  icon: React.ReactNode;
  action?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
};

export const EntryAction: React.FC<Props> = ({
  label,
  action,
  icon,
  disabled,
  ...rest
}) => (
  <Button
    size="small"
    type="text"
    onClick={action}
    icon={icon}
    title={label}
    aria-label={label}
    disabled={disabled}
    {...rest}
  />
);
