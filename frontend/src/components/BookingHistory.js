import React, { useState, useEffect, useContext } from 'react';
import bookingService from '../services/bookingService';
import AuthContext from '../context/AuthContext';
import Booking from './Booking';
import './BookingHistory.css'; // Import the new styles
import { useNavigate } from 'react-router-dom';

const BookingHistory = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/'); // Redirect to the homepage or another appropriate page
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const bookingData = await bookingService.getBookingHistory(user._id);
        setBookings(bookingData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load booking history.');
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.deleteBooking(bookingId);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking.');
    }
  };

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="booking-history-container">
      <h2>Booking History</h2>
      {bookings.length === 0 ? (
        <p className="no-bookings-message">No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <Booking
            key={booking._id}
            booking={booking}
            onCancel={() => handleCancelBooking(booking._id)}
          />
        ))
      )}
    </div>
  );
};

export default BookingHistory;
