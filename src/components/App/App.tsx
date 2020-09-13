import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import Users from '../Users/Users';
import Home from '../Home/Home';
import Tasks from '../Tasks/Tasks';
import ReviewRequests from '../ReviewRequests/ReviewRequests';
import Reviews from '../Reviews/Reviews';
import SingleReview from '../SingleReview/SingleReview';
import Sessions from '../Sessions/Sessions';
import Navbar from '../Navbar/Navbar';
import './App.scss';
import { UserRole, User, Auth } from '../../models/data-models';
import Login from '../Login/Login';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { getReviewRequests, getTasks, postUserFetch } from '../../actions';
import {
  AppReduxState,
  ReviewRequestsAppState,
  TasksState,
} from '../../models/redux-models';

type AppDispatch = ThunkDispatch<User, void, AnyAction>;

const App = (): JSX.Element => {
  const [role, setRole] = useState<UserRole>('student');
  const { Header, Content } = Layout;

  const auth = useSelector<AppReduxState, Auth>(
    (state) => state.auth,
    shallowEqual
  );

  const tasks = useSelector<AppReduxState, TasksState>(
    (state) => state.tasks,
    shallowEqual
  );

  const requests = useSelector<AppReduxState, ReviewRequestsAppState>(
    (state) => state.reviewRequests,
    shallowEqual
  );

  const handleRoleChange = (
    event: React.FormEvent<HTMLSelectElement>
  ): void => {
    setRole(event.currentTarget.value as UserRole);
  };

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(postUserFetch());
    dispatch(getTasks());
    dispatch(getReviewRequests());
  }, [dispatch]);

  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Navbar role={role} />
        </Header>
        <Content className="app-content">
          <div>
            <select value={role} onChange={handleRoleChange}>
              <option value="author">Author</option>
              <option value="student">Student</option>
              <option value="supervisor">Supervisor</option>
              <option value="coursemanager">Course Manager</option>
            </select>
          </div>
          <div className="router-switch-wrap">
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <ProtectedRoute path="/users" redirectPath="/login">
                <Users />
              </ProtectedRoute>
              <ProtectedRoute path="/tasks" redirectPath="/login">
                <Tasks />
              </ProtectedRoute>
              <ProtectedRoute path="/review-requests" redirectPath="/login">
                <ReviewRequests
                  auth={auth}
                  tasks={tasks}
                  reviewRequests={requests}
                />
              </ProtectedRoute>
              <ProtectedRoute path="/reviews/:reviewId" redirectPath="/login">
                <SingleReview />
              </ProtectedRoute>
              <ProtectedRoute path="/reviews" redirectPath="/login">
                <Reviews />
              </ProtectedRoute>
              <ProtectedRoute path="/sessions" redirectPath="/login">
                <Sessions />
              </ProtectedRoute>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
