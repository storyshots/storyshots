import { Button, Form, notification, TimePicker, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

export const Clock: React.FC = () => {
  const [form] = Form.useForm();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1_000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
      }}
    >
      <Form
        labelCol={{
          xs: { span: 24 },
          sm: { span: 8 },
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 16 },
        }}
        form={form}
        name="register"
        style={{ maxWidth: 600, margin: 'auto' }}
      >
        <Typography.Title>{date.toLocaleString()}</Typography.Title>
        <Form.Item name="time" label="Arrival time">
          <TimePicker />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          }}
        >
          <Button
            type="primary"
            onClick={() =>
              setTimeout(() => {
                notification.info({ message: 'A message' });
              }, 10_000)
            }
          >
            Show current time after 10 seconds
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
