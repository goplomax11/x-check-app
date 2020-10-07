import React, { useState } from 'react';
import { Button } from 'antd';
import { TasksState } from '../../models/redux-models';
import EditSessionForm from '../EditSessionForm/EditSessionForm';

interface CreateSessionProps {
  tasks: TasksState;
}

const CreateSession = ({ tasks }: CreateSessionProps): JSX.Element => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button
        onClick={(): void => setVisible(true)}
        type="primary"
        className="create-btn"
      >
        Add session
      </Button>
      <EditSessionForm
        tasks={tasks}
        onCloseOrSubmit={(): void => setVisible(false)}
        visible={visible}
      />
    </div>
  );
};

export default CreateSession;
