import React, { useEffect, useState } from 'react';
import api from '../api';
import '../css/userStyle.css';
import { jwtDecode } from 'jwt-decode';
import CookieStore from '../CookieStore';
import { useNavigate } from 'react-router-dom'; // Import for navigation

const CurrentUserTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate(); // Navigation function

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('flask', '/users');

        if (response.message !== 'ok') {
          throw new Error('Failed to fetch users');
        }

        

        const data = await response.users;


        setUsers(data);
      } catch (error) {
        console.error(error);
        setErrorMessage('Error fetching users');
      }
    };

    const fetchTasks = async () => {
      try {
        const cookie = new CookieStore();
        const token = cookie.getToken();
        const jwtDecoded = jwtDecode(token);
        const owner_id = jwtDecoded.user_id;

        const response = await api.get('tasks', `/tasks/${owner_id}`);
        setTasks(response.tasks);
      } catch (error) {
        console.error('Error fetching tasks', error);
        setErrorMessage('Error fetching tasks');
      }
    };

    fetchUsers();
    fetchTasks();
  }, []);

  const findUserById = (id) => users.find((user) => user._id === id);

  const handleTaskClick = (task) => {
    navigate(`/task/${task._id}`); // Navigate to single task page with task ID
  };

  return (
    <div className="container-fluid">
      <h1>All Tasks</h1>
      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}
      {tasks.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Task Name</th>
              <th scope="col">Description</th>
              <th scope="col">Owner</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => {
              const owner = findUserById(task.owner);

              return (
                <tr key={task._id} onClick={() => handleTaskClick(task)}> {/* Add onClick handler */}
                  <th scope="row">{index + 1}</th>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    {owner ? `${owner.username} (${owner.nickname})` : '-'}
                  </td>
                  <td>{task.completed ? 'Completed' : 'Pending'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
};

export default CurrentUserTasks;
