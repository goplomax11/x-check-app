import React from 'react';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Modal, Form, InputNumber, Select, DatePicker, Checkbox } from 'antd';
import moment from 'moment';
import { CrossCheckSession, Task } from '../../models/data-models';
import { addError, createSession, updateSession } from '../../actions/actions';
import { TasksState } from '../../models/redux-models';

interface EditSessionFormProps {
  tasks: TasksState;
  session?: CrossCheckSession;
  onCloseOrSubmit: () => void;
  visible: boolean;
}

const EditSessionForm = ({
  tasks,
  session,
  onCloseOrSubmit,
  visible,
}: EditSessionFormProps): JSX.Element => {
  type AppDispatch = ThunkDispatch<Task, void, AnyAction>;
  const [form] = Form.useForm();

  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();

  let initialValues = {};
  if (session) {
    initialValues = {
      task: session.taskId,
      desiredReviews: session.desiredReviewersAmount,
      minReviews: session.minReiewsAmount,
      start: moment(session.startDate),
      end: moment(session.endDate),
      coef: session.coefficient,
      draftChecked: session.state === 'DRAFT',
    };
  }

  const handleOk = async (): Promise<void> => {
    try {
      const values = await form.validateFields([
        'task',
        'desiredReviews',
        'minReviews',
        'start',
        'end',
        'coef',
        'draftChecked',
      ]);
      const newSession: CrossCheckSession = {
        state: values.draftChecked ? 'DRAFT' : 'REQUESTS_GATHERING',
        taskId: values.task,
        startDate: values.start,
        endDate: values.end,
        discardMinScore: false,
        discardMaxScore: false,
        minReiewsAmount: values.minReviews,
        desiredReviewersAmount: values.desiredReviews,
        coefficient: values.coef !== undefined ? values.coef : 1,
        attendees: [],
      };

      if (session) {
        newSession.id = session.id;
        newSession.attendees = session.attendees;
        dispatch(updateSession(newSession));
      } else {
        dispatch(createSession(newSession));
      }
      history.push('/sessions');

      onCloseOrSubmit();
    } catch (errorInfo) {
      dispatch(addError('There was an error processing your request'));
    }
  };

  const handleCancel = (): void => {
    onCloseOrSubmit();
  };

  const tasksList = Object.values(tasks)
    .map((task: Task) => {
      return {
        id: task.id,
        title: task.title,
        state: task.state,
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

  return (
    <Modal
      title="Create Session"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} name="dynamic_rule" initialValues={initialValues}>
        <Form.Item
          label="Task:"
          name="task"
          rules={[{ required: true, message: 'Please choose task' }]}
        >
          <Select>{tasksOptions}</Select>
        </Form.Item>

        <Form.Item
          label="Start date"
          name="start"
          rules={[{ required: true, message: 'Please input start date.' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="end"
          label="End date "
          rules={[{ required: true, message: 'Please input start date.' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item label="Coefficient" name="coef">
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="minReviews"
          label="Min reviews amount"
          rules={[
            { required: true, message: 'Please input min reviews amount.' },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name="desiredReviews"
          label="Desired reviewers Amount"
          rules={[{ required: true, message: 'Please input desired reviews.' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item name="draftChecked" valuePropName="checked">
          <Checkbox>Save as draft</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSessionForm;
