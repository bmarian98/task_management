import React, { useState } from 'react';
import api from '../api';
import CookieStore from '../CookieStore';
import '../css/userStyle.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('flask', '/login', {
        username,
        password,
      });
      console.log(response)
      if (response.message === 'Login successful') {
       
        const cookie = new CookieStore();
        const token = cookie.getToken();
        cookie.setToken(token);
        console.log(token);
        
        localStorage.setItem('isLoggedIn', true);
        //localStorage.setItem('token', token); // Store token in local storage
        window.location.href = '/';
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Login failed. Please try again.');
    }
  };

  return (
    <div className="container-fluid d-flex h-screen justify-content-center align-items-center center-form">
      <div className="container bg-light rounded shadow p-4 d-flex flex-column w-50 form-container"> {/* Added w-50 */}
        <h2 className="text-center">Login Form</h2> {/* Added text-center class */}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center mb-3"> {/* Added className */}
          <div className="mb-3 w-75"> {/* Adjusted width */}
            <label htmlFor="username" className="form-label mr-2">Username</label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3 w-75"> {/* Adjusted width */}
            <label htmlFor="password" className="form-label mr-2">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-75 mt-3">Login</button> {/* Adjusted button width and margin */}
        </form>
        <p className="text-center mt-3">  {/* Added text-center class */}
          Not a member? <a href="/register"> Register now</a>
        </p>
      </div>
    </div>
  );
  
  
  
  
  
  
};

export default Login;
