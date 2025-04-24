import React, { useState } from 'react';
import './Login.css';

const Login = () => {

    const [action,setAction] = useState("Sign Up");
  return (
    <div className="login-page">
      <div className="login-box">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <input type="text" placeholder="Username" />
          </div>
          <div className="input">
            <input type="password" placeholder="Password" />
          </div>
        </div>
        <div className="forgot-password">Forgot Password? <span>Click Here!</span></div>
        <div className="submit-container">
            <button className="submit">Sign Up</button>
            <button className="submit">Log In</button>
        </div>
      </div>
    </div>
  );
};

export default Login;