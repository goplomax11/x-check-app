import React, { useEffect, useState } from 'react';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Form, Input } from 'antd';
import {
  Auth,
  Task,
  TaskItem,
  TaskItemCategory,
  TaskState,
} from '../../models/data-models';
import './TaskForm.scss';
import { createTask, getSignleTask, updateTask } from '../../actions/actions';
import { AppReduxState, TasksState } from '../../models/redux-models';
import CreateTaskAddedItems from '../CreateTaskAddedItems/CreateTaskAddedItems';
import CreateTaskAddOneItem from '../CreateTaskAddOneItem/CreateTaskAddOneItem';
import CreateTaskActions from '../CreateTaskActions/CreateTaskActions';

type AppDispatch = ThunkDispatch<Task, void, AnyAction>;
const scopes = ['Basic Scope', 'Extra Scope', 'Fines'] as TaskItemCategory[];

interface CreateTaskProps {
  taskId?: string;
}

const TaskForm = ({ taskId }: CreateTaskProps): JSX.Element => {
  const [task, setTask] = useState<Task | null>(null);
  const { githubId } = useSelector<AppReduxState, Auth>((state) => state.auth);
  const dummyTask: Task = {
    id: '',
    title: '',
    author: githubId,
    state: 'DRAFT',
    categoriesOrder: scopes as TaskItemCategory[],
    items: [],
  };
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();

  // if we have taskId, it means we edit a task, otherwise, we are creating one
  useEffect(() => {
    if (taskId) {
      dispatch(getSignleTask(taskId));
    }
  }, [taskId]);

  const tasks = useSelector<AppReduxState, TasksState>((state) => state.tasks);

  useEffect(() => {
    setTask(taskId ? tasks[taskId] : dummyTask);
  }, [taskId]);

  const handleChangeItems = (newItems: TaskItem[]): void => {
    if (task) setTask({ ...task, items: newItems });
  };

  const handleTaskSubmit = (state: TaskState): void => {
    if (task) {
      if (taskId) {
        dispatch(updateTask({ ...task, state }));
      } else {
        dispatch(createTask({ ...task, state }));
      }
      history.push('/tasks');
    }
  };

  const handleTaskCancel = (): void => {
    setTask(dummyTask);
    history.push('/tasks');
  };
  return (
    <>
      {task && (
        <Form layout="vertical">
          <Form.Item label="Task Title" required>
            <Input
              placeholder="Task Title"
              value={task.title}
              onChange={(e): void =>
                setTask({ ...task, title: e.target.value })
              }
            />
          </Form.Item>
          <CreateTaskAddOneItem
            items={task.items}
            onChangeItems={handleChangeItems}
            scopes={scopes}
          />
          <CreateTaskAddedItems
            items={task.items}
            onChangeItems={handleChangeItems}
          />
          <CreateTaskActions
            onTaskSubmit={handleTaskSubmit}
            onTaskCancel={handleTaskCancel}
            state={task.state}
          />
        </Form>
      )}
    </>
  );
};

export default TaskForm;
