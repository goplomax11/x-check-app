import { Button } from 'antd';
import React from 'react';
import { TaskState } from '../../models/data-models';

interface CreateTaskActionsProps {
  onTaskSubmit: (state: TaskState) => void;
  onTaskCancel: () => void;
  state: TaskState;
}

const CreateTaskActions = ({
  onTaskSubmit,
  onTaskCancel,
  state,
}: CreateTaskActionsProps): JSX.Element => {
  return (
    <>
      <Button
        className="create-task-button"
        type="primary"
        onClick={(): void => onTaskSubmit('PUBLISHED')}
      >
        Submit task
      </Button>
      {state === 'DRAFT' && (
        <Button
          className="create-task-button"
          type="default"
          onClick={(): void => onTaskSubmit('DRAFT')}
        >
          Save draft
        </Button>
      )}
      <Button className="create-task-button" danger onClick={onTaskCancel}>
        Cancel
      </Button>
    </>
  );
};

export default CreateTaskActions;
