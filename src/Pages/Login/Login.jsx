import React, { useState } from 'react';
import './Login.css';

const Login = () => {
    const [action, setAction] = useState("Login");
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`${action} attempt with:`, formData);
        // Here you would add your Axios call to the backend
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <div className="header">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="inputs">
                        {action === "Sign Up" && (
                            <div className="input">
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="Email" 
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="input">
                            <input 
                                type="text" 
                                name="username"
                                placeholder="Username" 
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="input">
                            <input 
                                type="password" 
                                name="password"
                                placeholder="Password" 
                                value={formData.password}
                                onChange={handleInputChange}
                                minLength="8"
                                required
                            />
                        </div>
                    </div>
                    <div className="forgot-password">Forgot Password? <span>Click Here!</span></div>
                    <div className="submit-container">
                        <button 
                            type="button" 
                            className={action === "Login" ? "submit active" : "submit"}
                            onClick={() => setAction("Login")}
                        >
                            Login
                        </button>
                        <button 
                            type="button" 
                            className={action === "Sign Up" ? "submit active" : "submit"}
                            onClick={() => setAction("Sign Up")}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;