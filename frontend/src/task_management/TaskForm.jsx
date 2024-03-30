import React, { useEffect, useState } from 'react';
import api from '../api';
import '../css/userStyle.css';
import {jwtDecode} from 'jwt-decode';
import CookieStore from '../CookieStore';

const CreateTask = ({ onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    

    const fetchUsers = async () => {
        try{
            const response = await api.get('flask', '/users');
            console.log("->" + response.message);
            if (response.message !== "ok"){
                throw new Error('Faild to fetch users');
            }

            const data = await response.users;
            setUsers(data);
        }catch(error){
            console.error(error);
            setErrorMessage('Error fetching users');
        }
    };
    fetchUsers();
}, []);


  const handleSubmit =  async (event) => {
    event.preventDefault();
   
    setIsSubmitting(true);

    const cookie = new CookieStore();
    const token = cookie.getToken();
    const jwtDecoded = jwtDecode(token);
    const owner_id = jwtDecoded.user_id;

    try{
        const response = await api.post('tasks', '/create_task', {
            title,
            description,
            assignedTo,
            owner_id
        })

        if(response.message === 'Task created successfully'){
            setTitle('');
            setDescription('');
            setAssignedTo('');
        }
    } catch(error){
        console.error('Creating task error:', error );
        setErrorMessage('An error occured during task creation.');
    } finally{
        setIsSubmitting(false);
    }

    
  };

  return (
    <div className="container-fluid center-form">
      <form onSubmit={handleSubmit} className="container bg-light rounded shadow p-4 d-flex flex-column w-50 align-items-center form-container">
        <div className="mt-3">
          <h1>Create Task</h1>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <div className="form-group">
            <label htmlFor="title">Task Title:</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (Optional):</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
            />
          </div>
          <div className="form-group">
            <label htmlFor="assignedTo">Assign To:</label>
            <select
              className="form-control"
              id="assignedTo"
              name="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
            >
              <option value="">-- Select User --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.nickname})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default CreateTask;
