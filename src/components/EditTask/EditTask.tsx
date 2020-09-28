import React from 'react';
import { useParams } from 'react-router-dom';
import TaskForm from '../TaskForm/TaskForm';

const EditTask = (): JSX.Element => {
  const { taskId } = useParams<{ taskId: string }>();
  return <TaskForm taskId={taskId} />;
};

export default EditTask;
