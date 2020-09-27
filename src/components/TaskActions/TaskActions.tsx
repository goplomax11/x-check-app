import React from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Auth, Task, TaskState } from '../../models/data-models';
import './TaskActions.scss';
import { AppReduxState, TasksState } from '../../models/redux-models';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { deleteTask, updateTask } from '../../actions/actions';
import { useHistory } from 'react-router-dom';

interface TaskActionsProps {
  task: Task;
}

type AppDispatch = ThunkDispatch<TasksState, void, AnyAction>;

const TaskActions = ({ task }: TaskActionsProps): JSX.Element => {
  const auth = useSelector<AppReduxState, Auth>((state) => state.auth);

  const dispatch: AppDispatch = useDispatch();
  const handleDeleteTask = () => {
    dispatch(deleteTask(task.id!));
  };

  const history = useHistory();
  const handleEditTask = () => {
    console.log(task.id);
    history.push(`/edit-task/${task.id!}`);
  };

  const handleUpdateTaskState = (state: TaskState) => {
    dispatch(updateTask({ ...task, state }));
  };

  return (
    <div className="task-actions">
      {auth.roles.includes('student') && (
        <Button type="primary" size="small">
          Submit
        </Button>
      )}
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
          <Button type='primary'
                  target='blanck'
                  href={`http://localhost:3001/tasks/${task.id}`}
                  size='small'
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
