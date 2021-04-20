import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import LoadingToRedirect from './LoadingToRedirect';

const  UserPrivateRoute = ({ children, ...rest }) => {
  const user = useSelector(state => state.user);
  
  return user && user.token ? (
    <Route {...rest} render={() => children} />
  ) : (
    <LoadingToRedirect />
  );
}

export default UserPrivateRoute;