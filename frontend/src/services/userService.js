import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const getUserProfile = async (id) => {
  const response = await axios.get(`${API_URL}/api/users/${id}`);
  return response.data;
};

const userService = {
  getUserProfile,
};

export default userService;
