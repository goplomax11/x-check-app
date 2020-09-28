import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Alert } from 'antd';
import { HIDE_ERROR } from '../../constants/actions';
import { AppReduxState, ErrorState } from '../../models/redux-models';
import './ErrorNotification.scss';

type AppDispatch = ThunkDispatch<ErrorState, void, AnyAction>;

const ErrorNotification = (): JSX.Element => {
  const error = useSelector<AppReduxState, ErrorState>((state) => state.error);

  const dispatch: AppDispatch = useDispatch();

  const handleClose = (): void => {
    dispatch({ type: HIDE_ERROR });
  };

  return (
    <>
      {error && (
        <Alert
          className="error-alert"
          message="Error"
          description={error}
          type="error"
          closable
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default ErrorNotification;
