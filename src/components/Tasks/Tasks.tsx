import React, { useEffect } from 'react';
import { Button, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SingleTask from '../SingleTask/SingleTask';
import { AppReduxState, TasksState } from '../../models/redux-models';
import { Auth, Task } from '../../models/data-models';
import './Tasks.scss';
import { getTasks } from '../../actions/actions';
import StateBadge from '../StateBadge/StateBadge';

type AppDispatch = ThunkDispatch<TasksState, void, AnyAction>;

const Tasks = (): JSX.Element => {
  const { Panel } = Collapse;

  const tasks = useSelector<AppReduxState, Task[]>((state) => {
    if (
      state.auth.roles.includes('supervisor') ||
      state.auth.roles.includes('coursemanager') ||
      state.auth.roles.includes('author')
    ) {
      return Object.values(state.tasks);
    }
    return Object.values(state.tasks).filter(
      (task: Task) => task.state === 'PUBLISHED'
    );
  });

  const auth = useSelector<AppReduxState, Auth>((state) => state.auth);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const history = useHistory();
  const handleAddTask = (): void => {
    history.push('/create-task');
  };

  return (
    <div className="tasks">
      <h2>Tasks</h2>
      {(auth.roles.includes('author') ||
        auth.roles.includes('coursemanager')) && (
        <Button
          type="primary"
          onClick={handleAddTask}
          className="create-task-btn"
        >
          Add Task
        </Button>
      )}
      <Collapse
        accordion
        expandIcon={({ isActive }): JSX.Element => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        {Object.values(tasks).map((item: Task) => {
          return (
            <Panel
              header={item.title}
              key={item.id!}
              extra={<StateBadge state={item.state} />}
            >
              <SingleTask singleTask={item} />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default Tasks;
