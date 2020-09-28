import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Spin, Button, Select } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import { githubUserFetch, loginUser } from '../../actions/actions';
import { AppReduxState } from '../../models/redux-models';
import { Auth, UserRole } from '../../models/data-models';
import * as URLS from '../../constants/urls';
import './Login.scss';

type AppDispatch = ThunkDispatch<Auth, void, AnyAction>;

const Login = (): JSX.Element => {
  const { githubId, isLoading, isShowRoleSelector } = useSelector<
    AppReduxState,
    Auth
  >((state) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const [roles, setRoles] = useState<UserRole[]>(['student']);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes('?code=');

    if (hasCode) {
      const newUrl = url.split('?code=');
      window.history.pushState({}, '', newUrl[0]);

      const code = newUrl[1];

      dispatch(githubUserFetch(code));
    }
  }, [dispatch]);

  const handleRoleChange = (value: UserRole[]): void => {
    setRoles(value);
  };

  const handlerLoginClick = (): void => {
    dispatch(
      loginUser({
        githubId,
        roles,
      })
    );
    setRedirect(true);
  };

  const renderLogin = isShowRoleSelector ? (
    <div className="login__roles">
      <div>Choose your role, {githubId}</div>
      <Select
        value={roles}
        onChange={handleRoleChange}
        className="login__select"
        mode="multiple"
        defaultValue={['student']}
      >
        <Select.Option value="author">Author</Select.Option>
        <Select.Option value="student">Student</Select.Option>
        <Select.Option value="supervisor">Supervisor</Select.Option>
        <Select.Option value="coursemanager">Course Manager</Select.Option>
      </Select>
      <Button onClick={handlerLoginClick}>Log In</Button>
    </div>
  ) : (
    <Button
      type="primary"
      icon={<GithubOutlined />}
      href={`https://github.com/login/oauth/authorize?client_id=${URLS.CLIENT_ID}`}
    >
      SignUp via GitHub
    </Button>
  );

  return (
    <div className="login">
      {redirect ? <Redirect to="/" /> : null}
      {isLoading ? <Spin /> : renderLogin}
    </div>
  );
};

export default Login;
