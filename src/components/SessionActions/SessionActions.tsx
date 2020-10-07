import React, { useState } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import './SessionActions.scss';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import {
  AppReduxState,
  SessionsState,
  TasksState,
} from '../../models/redux-models';
import EditSessionForm from '../EditSessionForm/EditSessionForm';
import {
  Auth,
  CrossCheckSession,
  CrossCheckSessionState,
} from '../../models/data-models';
import { updateSession } from '../../actions/actions';

interface SessionActionsProps {
  session: CrossCheckSession;
  tasks: TasksState;
}

type AppDispatch = ThunkDispatch<SessionsState, void, AnyAction>;

const SessionActions = ({
  session,
  tasks,
}: SessionActionsProps): JSX.Element => {
  const auth = useSelector<AppReduxState, Auth>((state) => state.auth);

  const [visible, setVisible] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  // const history = useHistory();
  const handleEditSession = (): void => {
    /// / TODO: modal here
    setVisible(true);
  };

  const handleUpdateSessionState = (state: CrossCheckSessionState): void => {
    dispatch(updateSession({ ...session, state }));
  };

  return (
    <div className="session-actions">
      {(auth.roles.includes('author') ||
        auth.roles.includes('coursemanager')) && (
        <>
          {session.state === 'DRAFT' && (
            <>
              <Button type="primary" size="small" onClick={handleEditSession}>
                Edit
              </Button>
              <EditSessionForm
                tasks={tasks}
                session={session}
                onCloseOrSubmit={(): void => setVisible(false)}
                visible={visible}
              />
              <Button
                type="primary"
                size="small"
                onClick={(): void =>
                  handleUpdateSessionState('REQUESTS_GATHERING')
                }
              >
                Gather Requests
              </Button>
            </>
          )}
          {session.state === 'REQUESTS_GATHERING' && (
            <Button
              type="primary"
              size="small"
              onClick={(): void => handleUpdateSessionState('CROSS_CHECK')}
            >
              Start Cross-Check
            </Button>
          )}
          {session.state === 'CROSS_CHECK' && (
            <Button
              size="small"
              type="primary"
              onClick={(): void => handleUpdateSessionState('COMPLETED')}
            >
              Finish Session
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default SessionActions;
