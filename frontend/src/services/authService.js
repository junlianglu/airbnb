import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
  const { token } = response.data;
  localStorage.setItem('token', token);
  const user = jwtDecode(token);
  return user;
};

const register = async (userData) => {
  await axios.post(`${API_URL}/api/auth/register`, userData);
};

const authService = {
  login,
  register
};

export default authService;
