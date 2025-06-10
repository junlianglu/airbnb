import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import './BookingForm.css';

const BookingForm = ({ propertyId, checkInDate, checkOutDate, pricePerNight }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const checkInDateObj = new Date(checkInDate);
      const checkOutDateObj = new Date(checkOutDate);
      const timeDifference = checkOutDateObj.getTime() - checkInDateObj.getTime();
      const numberOfNights = timeDifference / (1000 * 3600 * 24);
      const calculatedTotalPrice = numberOfNights * pricePerNight;
      setTotalPrice(calculatedTotalPrice);
    }
  }, [checkInDate, checkOutDate, pricePerNight]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        propertyId,
        checkInDate,
        checkOutDate,
        totalPrice
      };
      await bookingService.createBooking(bookingData);
      navigate('/booking-success');
    } catch (error) {
      console.error('Error making booking:', error);
    }
  };

  const handleBackClick = () => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="booking-form-container">
      <form onSubmit={handleBooking} className="booking-form">
        <h2>Booking Summary</h2>

        <div>
          <label className="booking-form-label">Dates:</label>
          <p className="booking-form-value">
            {checkInDate && checkOutDate ? `${new Date(checkInDate).toLocaleDateString()} – ${new Date(checkOutDate).toLocaleDateString()}` : 'MM/DD – MM/DD'}
          </p>
        </div>

        <div>
          <label className="booking-form-label">Total Price:</label>
          <p className="booking-form-value">${totalPrice.toFixed(2)}</p>
        </div>

        <button type="submit" className="primary-button" disabled={!checkInDate || !checkOutDate}>
          Book Now
        </button>

        <button type="button" onClick={handleBackClick} className="secondary-button">
          Back to Property Details
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
