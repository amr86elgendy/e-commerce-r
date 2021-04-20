import React, { useEffect, useState } from 'react';
import { auth } from '../../Firebase';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const Register = ({ history }) => {
  const [email, setEmail] = useState("");

  const user = useSelector(state => state.user)

  useEffect(() => {
    if (user && user.token) history.push("/")
  }, [user, history])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true
    }
    await auth.sendSignInLinkToEmail(email, config)
    toast.success(
      `Email is sent to ${email}. Click the link to complete your registration.`
    );
    // save user email in local storage
    localStorage.setItem("emailForRegistration", email);

    setEmail("");
  };
  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h4>Register</h4>
          <form onSubmit={handleSubmit}>
            <input
              type='email'
              className='form-control mt-3'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              autoFocus
            />

            <button type='submit' className='btn btn-raised mt-5'>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
