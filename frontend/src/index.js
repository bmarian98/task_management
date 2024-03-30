import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RegistrationForm from './user_management/RegistrationForm'; // Assuming RegistrationForm.jsx exists
import Profile from './user_management/Profile'; // Assuming Profile.jsx exists
import Navbar from  './Navbar';
import Main from './user_management/Main';
import Login from './user_management/Login';
import Logout from './user_management/Logout';
import UpdateProfileForm from './user_management/UpdateProfileForm';
import CreateTask from './task_management/TaskForm';
import AllTasks from './task_management/AllTasks';
import CurrentUserTasks from './task_management/CurrentUserTasks';
import TaskView from './task_management/TaskView';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <App />
    {window.location.pathname !== '/login' && window.location.pathname !== '/register' && <Navbar />} 
    <Routes>
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      
      <Route path="*" element={<ProtectedRoute>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/update" element={<UpdateProfileForm />} />
            <Route path="/create_task" element={<CreateTask />} />
            <Route path="/tasks" element={<AllTasks />} />
            <Route path="/my_tasks" element={<CurrentUserTasks />} />
            <Route path="/task/:taskId" element={<TaskView />} />
          </Routes>
        </ProtectedRoute>} />
    </Routes>

    
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
