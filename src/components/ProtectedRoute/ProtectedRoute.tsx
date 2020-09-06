import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export interface PrivateRouteProps extends RouteProps {
  isAuth: boolean; // is authenticate route
  redirectPath: string; // redirect path if don't authenticate route
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuth,
  redirectPath,
  component,
  ...rest
}) => {
  return isAuth ? (
    <Route {...rest} component={component} render={undefined} />
  ) : (
    <Redirect to={{ pathname: redirectPath }} />
  );
};

export default PrivateRoute;