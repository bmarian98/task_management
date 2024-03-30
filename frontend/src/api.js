import axios from 'axios';

axios.defaults.withCredentials = true;
//localStorage.setItem('isLoggedIn', false);

const BACKENDS = {
  flask: {
    baseUrl: 'http://localhost:5000',  // Replace with your Flask backend URL
  },
  tasks: {
    baseUrl: 'http://localhost:5001',  // Replace with your Flask backend URL
  },
//   tasks: {
//     baseUrl: 'http://localhost:5001',  // Replace with your Flask backend URL
//   },
};

const getAxiosInstance = (backendName) => {
  // Configure axios instance with base URL and potentially custom headers if needed
  return axios.create({ baseURL: BACKENDS[backendName].baseUrl });
};

const makeRequest = async (backendName, method, url, data = {}) => {
  const axiosInstance = getAxiosInstance(backendName);
  try {
    const response = await axiosInstance[method](url, data);
    return response.data;
  } catch (error) {
    // Handle errors gracefully, e.g., return default values, log errors
    console.error('API request error:', error);
    return null; // Or throw an error if appropriate
  }
};

export default {
  get: (backendName, url) => makeRequest(backendName, 'get', url),
  delete: (backendName, url) => makeRequest(backendName, 'delete', url),
  post: (backendName, url, data) => makeRequest(backendName, 'post', url, data),
  put: (backendName, url, data) => makeRequest(backendName, 'put', url, data),
  // ... add other methods (put, delete) as needed
};
