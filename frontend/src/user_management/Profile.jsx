import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the API abstraction layer
import CookieStore from '../CookieStore';
import male from './images/male.png';
import female from './images/female.png';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const cookie = new CookieStore();
        const token = cookie.getToken();
        cookie.setToken(token);
        
        const response = await api.get('flask', '/profile'); // Replace with your Flask profile endpoint

        setUserData(response.profile); // Assuming data is in response.data
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('An error occurred while retrieving your profile.');
      }
    };

    fetchUserData();
  }, []);

  // Display profile information or handle loading/error states

  return (
    <div className="container mt-3 d-flex flex-column align-items-center"> {/* Centered container */}
      <div className="card border shadow p-4 w-75"> {/* Card for profile information */}
        <h1>Profile</h1>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {userData ? (
          <div className="d-flex flex-row align-items-center mt-3"> {/* Flexbox for row layout */}
            <div className="mr-5"> {/* Margin for spacing */}
              {userData.gender === "male" ? (
                <img src={male} alt="Male icon" className="rounded-circle mb-2" width="100" height="100" />
              ) : (
                <img src={female} alt="Female icon" className="rounded-circle mb-2" width="100" height="100" />
              )}
            </div>
            <div className="mx-5"> {/* User details */}
              <p>
                <b>Username:</b> {userData.username}
              </p>
              <p>
                <b>Nickname:</b> {userData.nickname}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading profile information...</p>
        )}
      </div>
    </div>
  );
  
  
  
};

export default Profile;
