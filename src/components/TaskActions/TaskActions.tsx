import React from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './TaskActions.scss';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Auth, Task, TaskState } from '../../models/data-models';
import { AppReduxState, TasksState } from '../../models/redux-models';
import { deleteTask, updateTask } from '../../actions/actions';
import { JSON_API_URL } from '../../constants/urls';

interface TaskActionsProps {
  task: Task;
}

type AppDispatch = ThunkDispatch<TasksState, void, AnyAction>;

const TaskActions = ({ task }: TaskActionsProps): JSX.Element => {
  const auth = useSelector<AppReduxState, Auth>((state) => state.auth);

  const dispatch: AppDispatch = useDispatch();
  const handleDeleteTask = () => {
    dispatch(deleteTask(task.id));
  };

  const history = useHistory();
  const handleEditTask = () => {
    history.push(`/edit-task/${task.id}`);
  };

  const handleUpdateTaskState = (state: TaskState) => {
    dispatch(updateTask({ ...task, state }));
  };

  return (
    <div className="task-actions">
      {(auth.roles.includes('author') ||
        auth.roles.includes('coursemanager')) && (
        <>
          {task.state === 'DRAFT' && (
            <>
              <Button type="primary" size="small" onClick={handleEditTask}>
                Edit
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => handleUpdateTaskState('PUBLISHED')}
              >
                Publish
              </Button>
            </>
          )}
          <Button
            type="primary"
            target="_blank"
            href={`${JSON_API_URL}/tasks/${task.id}`}
            size="small"
            download
          >
            Export As JSON
          </Button>
          {task.state !== 'ARCHIVED' && (
            <Button
              size="small"
              onClick={() => handleUpdateTaskState('ARCHIVED')}
            >
              Archive
            </Button>
          )}
          <Button size="small" danger onClick={handleDeleteTask}>
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

export default TaskActions;
