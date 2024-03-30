import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming use of React Router
import api from '../api';

const TaskView = () => {
  const { taskId } = useParams(); // Get task ID from URL parameters
  const [users, setUsers] = useState([])
  const [task, setTask] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);


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

    const fetchTask = async () => {
      try {
        const response = await api.get('tasks', `/task/${taskId}`); // Replace with your fetching logic
        if (response.message !== "ok") {
          throw new Error('Failed to fetch task');
        }
        const data = await response;
        setTask(data.task);
      } catch (error) {
        console.error('Error fetching task:', error);
        setErrorMessage('Error fetching task');
      }
    };
    fetchUsers();
    fetchTask();
  }, [taskId]); // Re-fetch on task ID change

  const findUserById = (id) => users.find((user) => user._id === id);

  const handleMarkComplete = async () => {
    // Implement logic to mark task as complete on the backend
    try {
        const response = await api.put('tasks', `/tasks/${taskId}/status`,{
            "completed": "1" 
        }); 
        if (response.message !== "Task status updated successfully") {
          throw new Error('Failed to mark task completed');
        }
        window.location.reload();
    } catch (error) {
        console.error('Error fetching task:', error);
        setErrorMessage('Error fetching task');
    }
    // Example with optimistic UI update (replace with actual backend call)
    setTask({ ...task, status: 'Completed' });
  };

  const handleDeleteTask = async () => {
    // Implement logic to delete the task on the backend
    try {
        const response = await api.delete('tasks', `/tasks/${taskId}`); // Replace with your fetching logic
        
        if (response.message !== "Task status updated successfully") {
            throw new Error('Failed to mark task completed');
        }
        
    } catch (error) {
        console.error('Error fetching task:', error);
        setErrorMessage('Error fetching task');
    }

    // const navigate = useNavigate();
    // navigate('/tasks');
    window.location.href = "/tasks";
    // Example with optimistic UI removal (replace with actual backend call)
    setTask(null); // Remove task from state for immediate UI update
  };

  if (!task) {
    return errorMessage ? (
      <div className="alert alert-danger">{errorMessage}</div>
    ) : (
      <p>Loading task...</p>
    );
  }

  
  const { title, description, assignedTo , owner, completed } = task;
  const assignedUser = findUserById(assignedTo);
  const ownerUser = findUserById(owner);

  return (
    <div className="container">
      <h1>Task Details</h1>
      <div className="card">
        <div className="card-body">
          
          <h4 className='mb-4'>{title}</h4>
          <p>Description: {description}</p>
          <p>Assigned To: {assignedUser?.username || '-'} ({assignedUser?.nickname || '-'})</p>
          <p>Owner: {ownerUser?.username || '-'} ({ownerUser?.nickname || '-'})</p>
          <p>Status: {completed ? 'Completed' : 'Pending'}</p>
          <div className="d-flex justify-content-end mt-3"> {/* Use justify-content-end for right alignment */}
            <button
                className="btn btn-primary mx-3"
                disabled={completed === true } // Disable if already completed
                onClick={handleMarkComplete}
            >
                Mark Complete
            </button>
            <button className="btn btn-danger" onClick={handleDeleteTask}>
                Delete Task
            </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default TaskView;
