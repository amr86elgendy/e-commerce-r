import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { currentAdmin } from '../functions/auth';
import LoadingToRedirect from './LoadingToRedirect';

const  AdminPrivateRoute = ({ children, ...rest }) => {
  const user = useSelector(state => state.user);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          setOk(true);
        })
        .catch((err) => {
          setOk(false);
        });
    }
  }, [user]);
  
  return ok ? (
    <Route {...rest} render={() => children} />
  ) : (
    <LoadingToRedirect />
  );
}

export default AdminPrivateRoute;