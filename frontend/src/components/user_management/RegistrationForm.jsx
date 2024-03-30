import React, { useState } from 'react';
import api from '../api'; // Import the API abstraction layer
import '../css/userStyle.css'


const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true); // Set loading state

    try {
      const response = await api.post('flask', '/register', {
        username,
        password,
        gender,
        nickname,
      });

      if (response.message === 'User registered successfully') {
        console.log('Registration successful:', response);
        // Redirect to login page or show success message
        setUsername('');
        setPassword('');
        setGender('');
        setNickname('');
        setErrorMessage(''); // Clear any previous errors
        window.location.href = '/login';
      } else {
        setErrorMessage(response.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('An error occurred during registration.');
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <div className="container-fluid center-form"> {/* Added center-form class */}
      <form onSubmit={handleSubmit} className="container bg-light rounded shadow p-4 d-flex flex-column w-50 align-items-center form-container"> {/* Added form-container class */}
        <div className="mt-3">
          <h1>Registration</h1>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <div className="d-flex"> {/* Maintains horizontal layout for radio buttons */}
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="genderMale"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <label className="form-check-label" htmlFor="genderMale">
                  Male
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="genderFemale"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e)  => setGender(e.target.value)}
                />
                <label className="form-check-label" htmlFor="genderFemale">
                  Female
                </label>
              </div>
            </div>
          </div>
  
          <div className="form-group">
            <label htmlFor="nickname">Nickname:</label>
            <input
              type="text"
              className="form-control"
              id="nickname"
              name="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default RegistrationForm;
