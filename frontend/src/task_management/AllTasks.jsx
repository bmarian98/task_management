import React, { useEffect, useState } from 'react';
import api from '../api';
import '../css/userStyle.css';
import { useNavigate } from 'react-router-dom';

const AllTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
    
        const fetchUsers = async () => {
            try{
                const response = await api.get('flask', '/users');
               
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

        const fetchTasks = async () => {
            try{
                const response = await api.get('tasks', '/tasks');
                setTasks(response.tasks);
            }catch(error){
                console.error('Error extracting tasks', error);
                setErrorMessage('Error fetching tasks')
            }
        };

        fetchUsers();
        fetchTasks();
    }, []);

    const findUserById = (id) => users.find((user) => user._id === id);


    const handleTaskClick = (task) => {
        const taskId = task._id; // Assuming your task object has an _id property
        navigate(`/task/${taskId}`); // Use `navigate` for programmatic navigation
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
                <th scope="col">Assigned To</th>
                <th scope="col">Status</th>
            </tr>
            </thead>
            <tbody>
            {tasks.map((task, index) => {
                const owner = findUserById(task.owner);
                const assignedTo = findUserById(task.assignedTo);
                return (
                <tr key={task._id} onClick={() => handleTaskClick(task)}>
                    <th scope="row">{index + 1}</th>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{owner ? `${owner.username} (${owner.nickname})` : '-'}</td>
                    <td>{assignedTo ? `${assignedTo.username} (${assignedTo.nickname})` : '-'}</td>
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
}

export default AllTasks;