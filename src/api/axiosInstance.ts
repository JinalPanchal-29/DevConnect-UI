import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,          // send / receive HTTP-only JWT cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
