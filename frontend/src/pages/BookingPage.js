import React, { useContext, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import AuthContext from '../context/AuthContext';
import './BookingPage.css';

// Helper function to parse query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const BookingPage = () => {
  const { id } = useParams(); // Get the property ID from URL
  const query = useQuery();    // Get query parameters from URL
  const { user } = useContext(AuthContext); // Get user context
  const navigate = useNavigate(); // For redirecting

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if user is not signed in
    }
  }, [user, navigate]);

  // Extract check-in date, check-out date, and price per night from query parameters
  const checkInDate = query.get('checkInDate') ? new Date(query.get('checkInDate')) : null;
  const checkOutDate = query.get('checkOutDate') ? new Date(query.get('checkOutDate')) : null;
  const pricePerNight = query.get('pricePerNight');

  return (
    <div className="booking-page">
      {user && (
        <>
          <h2>Book this Property</h2>
          {/* Pass the extracted values to the BookingForm */}
          <BookingForm
            propertyId={id}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            pricePerNight={parseFloat(pricePerNight)}
          />
        </>
      )}
    </div>
  );
};

export default BookingPage;
