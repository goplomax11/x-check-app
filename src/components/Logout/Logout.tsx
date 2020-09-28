import React, { useState } from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Redirect } from 'react-router-dom';
import { logoutUser } from '../../actions/actions';
import { Auth, User } from '../../models/data-models';
import { AppReduxState } from '../../models/redux-models';

type AppDispatch = ThunkDispatch<User, void, AnyAction>;

const Logout = (): JSX.Element => {
  const { githubId } = useSelector<AppReduxState, Auth>((state) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  const [isRedirect, setIsRedirect] = useState(false);

  const logOutHandler = (): void => {
    dispatch(logoutUser());
    setIsRedirect(true);
  };

  return (
    <>
      {isRedirect ? <Redirect to="/login" /> : null}
      {githubId ? (
        <Button icon={<LogoutOutlined />} onClick={logOutHandler}>
          Logout
        </Button>
      ) : null}
    </>
  );
};

export default Logout;
