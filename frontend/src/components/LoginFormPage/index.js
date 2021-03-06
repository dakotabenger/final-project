import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as selectedActions from '../../store/selectedUser'
import './LoginForm.css';
import { NavLink } from 'react-router-dom';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const selectedUser = useSelector((state) => state.selectedUser.user)
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser && selectedUser) return <Redirect to="/home" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password })).then((res) => {
      dispatch(selectedActions.getUser(res.data.user.id))
    })
      .catch((res) => {
        if (res.data && res.data.errors) setErrors(res.data.errors);
      });
  };


  const handleDemoClick = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential: "demoUser", password:"password" })).then((res) => {
      dispatch(selectedActions.getUser(res.data.user.id))
    })
      .catch((res) => {
        if (res.data && res.data.errors) setErrors(res.data.errors);
      });
  };

  return (
    <div className="row ">
      <div className="col-sm-4">
        <img className="logo-front-page" src="./logo.png"></img>
      <h1 className="site-description"> Welcome to Utilivitas, a personal social media project where users can be matched based on interests and values, and 
        then have discussions on feeds. In the future, custom feeds will be added, as well as S3 image hosting, private invite codes, and data verfication (where members of your network can verify things you say on your profile or posts).
        This project was created by me, Dakota Benger. You can find my <a href="https://www.github.com/dakotabenger">GitHub here</a> and my <a href="https://docs.google.com/document/d/1xkkyMTuGX4L_u2kPIKwc92iVU7KS4pBoDhQofCNMir0/edit">resume here</a> . I am always looking for my next exiciting oppurtunity, so feel free to reach out to me if you have 
        something in mind. 
      </h1>

      </div>
      <div className="col-lg-4 row ">
        <div className="col-md-4"></div>
        <div className=" col-md-6 actual-login-container">
      <h1 className="login-header">Log In To Your Network</h1>
      <h3 className="signup-header">Don't have an account? Want a new account with different interests? <NavLink to="/signup">Click here.</NavLink></h3>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="form-group">
        <label className="username-label-login">
          Username:
          <input className="username-input-login"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <br></br>
        <label className="password-label-login">
          Password:
          <input className="password-input-login"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        </div>
        <div className="row">
        {/* <div className="col-sm-2"></div> */}
        <button className="col-sm-6 login-submit-button" type="submit">Log In</button>
        <button className="col-sm-6 login-submit-button" type="submit" onClick={(e) => handleDemoClick(e)}>Demo Login</button>

        <div className="col-sm-1"></div>
        </div>
      </form>
      </div>
      
</div>
<div className="col-sm-4 "></div>
    </div>
  );
}

export default LoginFormPage;
