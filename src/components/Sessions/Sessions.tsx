import React, { useEffect, useState } from 'react';
import { Collapse, Pagination, Modal } from 'antd';
import { AnyAction } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  AppReduxState,
  ReviewsState,
  SessionsState,
} from '../../models/redux-models';
import { CrossCheckSession } from '../../models/data-models';
import { getSession } from '../../actions/actions';
import StateTag from '../StateTag/StateTag';
import CreateSession from '../CreateSession/CreateSession';
import './Session.scss';
import SingleSession from '../SingleSession/SingleSession';

const { Panel } = Collapse;

type AppDispatch = ThunkDispatch<ReviewsState, void, AnyAction>;

const Sessions = (): JSX.Element => {
  const sessions = useSelector<AppReduxState, SessionsState>(
    (state) => state.sessions
  );

  const tasks = useSelector<AppReduxState, TasksState>((state) => state.tasks);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getSession());
  }, [dispatch]);

  const [sessionsArr, setSessionsArr] = useState<CrossCheckSession[]>([]);
  const [reviwers, setReviwers] = useState<string[]>([]);

  useEffect(() => {
    setSessionsArr(Object.values(sessions));
  }, [sessions]);

  return (
    <div className="sessions">
      <h2>Cross-Check Sessions</h2>
      <CreateSession tasks={tasks} />
      <Collapse accordion>
        {sessionsArr.map((session) => {
          if (session.id && tasks && tasks[session.taskId]) {
            return (
              <Panel
                header={tasks[session.taskId].title}
                key={session.id || session.endDate + session.taskId}
                extra={<StateTag state={session.state} />}
              >
                <SingleSession
                  session={session}
                  key={session.id}
                  tasks={tasks}
                />
              </Panel>
            );
          }
        })}
      </Collapse>
    </div>
  );
};

export default Sessions;
