import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { TasksState } from '../../models/redux-models';

export interface RequestReviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  tasks: TasksState;
  onHide?: Function;
  onSubmitClick: Function;
}

const RequestReview = (props: RequestReviewProps): JSX.Element => {
  const { tasks, onHide, onSubmitClick } = props;

  const tasksList = Object.keys(tasks)
    .map((key) => {
      return {
        id: tasks[key].id,
        title: tasks[key].title,
        state: tasks[key].state,
      };
    })
    .filter((task) => task.state === 'PUBLISHED');

  const tasksOptions: JSX.Element[] = tasksList.map((taskItem) => {
    return (
      <Select.Option value={taskItem.id} key={taskItem.id}>
        {taskItem.title}
      </Select.Option>
    );
  });

  const onFinish = (values: object): void => {
    if (onHide) {
      onHide();
    }
    onSubmitClick(values);
  };

  return (
    <Form name="request-review" layout="vertical" onFinish={onFinish}>
      <Form.Item label="Task:" name="task" rules={[{ required: true }]}>
        <Select>{tasksOptions}</Select>
      </Form.Item>
      <Form.Item
        label="PR URL:"
        name="pr-url"
        rules={[{ required: true, type: 'url' }]}
      >
        <Input placeholder="https://github.com/user/repo/pull/1" />
      </Form.Item>
      <Form.Item
        label="Demo URL:"
        name="demo-url"
        rules={[{ required: true, type: 'url' }]}
      >
        <Input placeholder="http://mysite.com" />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default RequestReview;
