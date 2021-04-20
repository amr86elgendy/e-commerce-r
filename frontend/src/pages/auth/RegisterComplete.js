import React, { useEffect, useState } from 'react';
import { auth } from '../../Firebase';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";

const RegisterComplete = ({ history }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setEmail(localStorage.getItem('emailForRegisteration'));
    console.log(window.location.href)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password is required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const result = await auth.signInWithEmailLink(email, window.location.href);
      if(result.user.emailVerified) {
        // remove user email fom local storage
        localStorage.removeItem("emailForRegisteration");
        // get user id token
        let user = auth.currentUser;
        await user.updatePassword(password);
        const idTokenResult = await user.getIdTokenResult();
        // redux store
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
          })
          .catch((err) => console.log(err));
        // redirect
        history.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  };
  
  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h4>Complete Registeration</h4>
          <form onSubmit={handleSubmit}>
            <input
              type='email'
              className='form-control mt-3'
              value={email}
              disabled
            />
            <input
              type='password'
              className='form-control mt-3'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
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

export default RegisterComplete;
