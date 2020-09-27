import React, { useState } from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import { TaskItem } from '../../models/data-models';
import './DisputeForm.scss';

interface DisputeFormProps {
  onSubmit: (score: number, message: string, taskItemId: string) => void;
  taskItem: TaskItem;
}

const DisputeForm = ({ onSubmit, taskItem }: DisputeFormProps): JSX.Element => {
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);

  const handleScoreChange = (value: string | number | undefined): void => {
    if (typeof value === 'number') {
      setScore(value);
    } else if (value) {
      setScore(parseInt(value, 10));
    } else {
      setScore(0);
    }
  };

  const [form] = Form.useForm();
  const resetDisputeData = (): void => {
    form.resetFields();
  };

  const handleSubmit = (): void => {
    onSubmit(score, message, taskItem.id);
    resetDisputeData();
    setDisabled(true);
  };

  return (
    <Form
      layout="inline"
      name="nest-messages"
      form={form}
      className="dispute-form"
    >
      <Form.Item
        name="Suggested Score"
        label="Suggested Score"
        rules={[
          { type: 'number', min: taskItem.minScore, max: taskItem.maxScore },
        ]}
      >
        <InputNumber value={score} onChange={handleScoreChange} />
      </Form.Item>
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
          disabled={disabled}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DisputeForm;
