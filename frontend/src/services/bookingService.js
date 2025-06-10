import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const createBooking = async (bookingData) => {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Pass the token for authorization
    },
  };
  const response = await axios.post(`${API_URL}/api/bookings`, bookingData, config);
  return response.data;
};

const getBookingHistory = async (userId) => {
  //alert("frontend1");
  const response = await axios.get(`${API_URL}/api/bookings/history`, {
    params: { userId }
  });
  //alert("frontend2");
  //alert(response.data);
  return response.data;
};

const deleteBooking = async (booking_Id) => {
  await axios.delete(`${API_URL}/api/bookings/${booking_Id}`);
};

const bookingService = {
  createBooking,
  getBookingHistory,
  deleteBooking,
};

export default bookingService;
