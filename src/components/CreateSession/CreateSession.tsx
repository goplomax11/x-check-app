import React, { useState } from 'react';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Modal, Button, Input, Form, InputNumber } from 'antd';
import { Task, CrossCheckSession } from '../../models/data-models';
import { createSession } from '../../actions/actions';

const CreateSession = (): JSX.Element => {
  type AppDispatch = ThunkDispatch<Task, void, AnyAction>;

  const [visible, setVisible] = useState(false);
  const [nameSession, setNameSession] = useState<string>('');
  const [nameTask, setTaskName] = useState('');
  const [startSession, setstartSession] = useState('');
  const [endSession, setEndSession] = useState('');
  const [coefficient, setCoefficient] = useState(0);
  const [minReviewsAmount, setMinReviewsAmount] = useState(0);
  const [desireReviewAmount, setDesireReviewAmount] = useState(0);

  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    const newSession: CrossCheckSession = {
      id: nameSession,
      state: 'DRAFT',
      taskId: nameTask,
      startDate: startSession,
      endDate: endSession,
      discardMinScore: false,
      discardMaxScore: false,
      minReiewsAmount: minReviewsAmount,
      desiredReviewersAmount: desireReviewAmount,
      coefficient: 1,
      attendees: [
        {
          githubId: 'ButterBrot777',
          reviewerOf: ['cardamo'],
        },
      ],
    };

    dispatch(createSession(newSession));
    history.push('/sessions');

    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button onClick={showModal} type="primary" className="create-btn">
        Add session
      </Button>
      <Modal
        title="Create Session"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form.Item label="Name of session">
          <Input
            value={nameSession}
            onChange={(e) => setNameSession(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Name of task">
          <Input
            value={nameTask}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Start date">
          <Input
            value={startSession}
            onChange={(e) => setstartSession(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="End date ">
          <Input
            value={endSession}
            onChange={(e) => setEndSession(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Coefficient">
          <InputNumber
            value={coefficient}
            onChange={(value) => setCoefficient((value as number) || 0)}
          />
        </Form.Item>

        <Form.Item label="Min reviews amount">
          <InputNumber
            value={minReviewsAmount}
            onChange={(value) => setMinReviewsAmount((value as number) || 0)}
          />
        </Form.Item>

        <Form.Item label="Desire reviewers Amount">
          <InputNumber
            value={desireReviewAmount}
            onChange={(value) => setDesireReviewAmount((value as number) || 0)}
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default CreateSession;
