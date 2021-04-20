import React, { useEffect, useState } from 'react';
import { auth, googleAuthProvider } from '../../Firebase';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrUpdateUser } from "../../functions/auth";


const Login = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  useEffect(() => {
    if (history.location.state) {
      return;
    } else {
      if (userState && userState.token) history.push('/');
    }
  }, [userState, history]);

  const roleBasedRedirect = (data) => {
    // CHECK IF USER COMING FROM CERTAIN ROUTE
    const prevRoute = history.location.state;
    if (prevRoute) {
      history.push(prevRoute.from)
    } else {
      if (data.role === 'admin') {
        history.push("/admin/dashboard")
      } else {
        history.push("/user/history")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      const idTokenResult = await user.getIdTokenResult();

      createOrUpdateUser(idTokenResult.token)
        .then(({ data }) => {
          dispatch({
            type: 'LOGGED_IN_USER',
            payload: {
              _id: data._id,
              name: data.name,
              email: data.email,
              role: data.role,
              token: idTokenResult.token
            },
          });
          roleBasedRedirect(data)
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async ({ user }) => {
        const idTokenResult = await user.getIdTokenResult();
        createOrUpdateUser(idTokenResult.token)
          .then(({ data }) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
                token: idTokenResult.token,
              },
            });
            roleBasedRedirect(data)
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          {loading ? (
            <h4 className='text-danger'>Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <input
                type='email'
                className='form-control'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Your email'
                autoFocus
              />
            </div>

            <div className='form-group'>
              <input
                type='password'
                className='form-control'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Your password'
              />
            </div>

            <br />
            <Button
              onClick={handleSubmit}
              type='primary'
              className='mb-3'
              block
              shape='round'
              icon={<MailOutlined />}
              size='large'
              disabled={!email || password.length < 6}
            >
              Login with Email/Password
            </Button>
          </form>
          <Button
            onClick={googleLogin}
            type='danger'
            className='mb-3'
            block
            shape='round'
            icon={<GoogleOutlined />}
            size='large'
          >
            Login with Google
          </Button>

          <Link to='/forgotpassword' className='float-right text-danger'>
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
