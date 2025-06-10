import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="booking-success-container">
      <div className="success-icon">✔️</div>
      <h2>Booking Successful!</h2>
      <p>Your booking has been successfully confirmed. Thank you for choosing us!</p>
      
      <button onClick={handleBackToHome} className="back-button">Back to Home</button>
    </div>
  );
};

export default BookingSuccess;
