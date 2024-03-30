import React from 'react';

const App = () => {

  return (
    <div className="container mt-3 d-flex flex-column align-items-center">
      <h1>Welcome to My App!</h1>
      <p className="lead mt-3">
        This is a simple application demonstrating user registration and profile management.
      </p>
      <div className="d-flex justify-content-center mt-5">
        <a href="/register" className="btn btn-primary me-3">Register</a>
        <a href="/profile" className="btn btn-outline-primary">View Profile</a>
      </div>
    </div>
  );
};

export default App;
