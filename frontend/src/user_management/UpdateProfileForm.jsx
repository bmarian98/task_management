import React, { useState } from 'react';
import api from '../api'; // Import the API abstraction layer
import '../css/userStyle.css'
import CookieStore from '../CookieStore';

const UpdateProfileForm = ({ user }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [nickname, setNickname] = useState('');  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(''); // Clear any previous error messages

    try {
      const cookie = new CookieStore();
      const token = cookie.getToken();
      cookie.setToken(token);
        
      const response = await api.put('flask', '/profile/update', {
        password,
        // username,
        // nickname,
      });

      if (response.message === 'Profile updated successfully') {
        // Handle successful update (e.g., display success message, redirect)
        console.log('Profile updated successfully!');
        // ... (your success handling logic)
        window.location.href = '/logout';
      } else {
        setErrorMessage(response.data.error || 'An error occurred while updating your profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('An error occurred while updating your profile. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-3 d-flex flex-column align-items-center"> {/* Centered container */}
      <div className="card border shadow p-4 w-75"> {/* Card for profile information */}
        <h1>Update Profile</h1>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          {/* <div className="form-group">
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
          </div> */}
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
          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileForm;
