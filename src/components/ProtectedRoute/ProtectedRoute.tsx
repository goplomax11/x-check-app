/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export interface PrivateRouteProps extends RouteProps {
  redirectPath: string;
  component: FC;
}

const ProtectedRoute: React.FC<PrivateRouteProps> = ({
  redirectPath = '' as string,
  component,
  ...rest
}: PrivateRouteProps) => {
  const isAuth = localStorage.getItem('githubId') || null;

  return isAuth ? (
    <Route {...rest} component={component} render={undefined} />
  ) : (
    <Redirect to={{ pathname: redirectPath as string }} />
  );
};

export default ProtectedRoute;
