import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import './FeedbackForm.scss';

interface FeedbackFormProps {
  onSubmit: (message: string) => void;
}

const FeedbackForm = ({ onSubmit }: FeedbackFormProps): JSX.Element => {
  const [message, setMessage] = useState<string>('');

  const [form] = Form.useForm();
  const resetFeedbackData = (): void => {
    form.resetFields();
  };

  const handleSubmit = (): void => {
    onSubmit(message);
    resetFeedbackData();
  };

  return (
    <Form
      layout="vertical"
      name="nest-messages"
      form={form}
      className="feedback-form"
    >
      <Form.Item name="Message" label="Message">
        <Input.TextArea
          rows={1}
          value={message}
          onChange={(e): void => setMessage(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit}
          className="submit-btn"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FeedbackForm;
