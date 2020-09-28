import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Table, Tag } from 'antd';
import { getUsers } from '../../actions/actions';
import { AppReduxState, UsersState } from '../../models/redux-models';
import { User, UserRole } from '../../models/data-models';

type State = UsersState;
type AppDispatch = ThunkDispatch<State, void, AnyAction>;

const Students = (): JSX.Element => {
  const users = useSelector<AppReduxState, User[]>((state) =>
    Object.values(state.users).map((user) => {
      return { ...user, key: user.githubId };
    })
  );

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const columns = [
    {
      title: 'Github ID',
      dataIndex: 'githubId',
      key: 'githubId',
    },
    {
      title: 'Roles',
      key: 'roles',
      dataIndex: 'roles',
      // eslint-disable-next-line react/display-name
      render: (roles: UserRole[]): JSX.Element => (
        <>
          {roles.map((role) => {
            let color = 'grey';
            if (role === 'author') {
              color = 'volcano';
            } else if (role === 'student') {
              color = 'green';
            } else if (role === 'supervisor') {
              color = 'magenta';
            } else if (role === 'coursemanager') {
              color = 'geekblue';
            }
            return (
              <Tag color={color} key={role}>
                {role.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={users} />;
};

export default Students;
