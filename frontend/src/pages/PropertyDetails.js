import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import propertyService from '../services/propertyService';
import AuthContext from '../context/AuthContext';
import AirbnbDatePicker from '../components/AirbnbDatePicker';
import MapComponent from '../components/MapComponent';
import Chatbox from '../components/Chatbox';
import './PropertyDetails.css';

const amenitiesList = {
  WiFi: { icon: '🛜', name: 'WiFi' },
  Pool: { icon: '🏊', name: 'Pool' },
  Kitchen: { icon: '🍽️', name: 'Kitchen' },
  "Air Conditioning": { icon: '❄️', name: 'Air Conditioning' },
  "Free Parking": { icon: '🚗', name: 'Free Parking' },
  "Pet Friendly": { icon: '🐾', name: 'Pet Friendly' }
};

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    propertyService.getPropertyById(id).then((data) => setProperty(data));
    propertyService.getBookedDates(id).then((dates) => setBookedDates(dates));
  }, [id]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleBookingClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (checkInDate && checkOutDate) {
      navigate(
        `/booking/${id}?checkInDate=${checkInDate.toISOString()}&checkOutDate=${checkOutDate.toISOString()}&pricePerNight=${property.price}`
      );
    }
  };

  const handleDateSelection = ({ startDate, endDate }) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
  };

  const getUnavailableDates = () => {
    const unavailableDates = [];
    bookedDates.forEach((booking) => {
      const currentDate = new Date(booking.startDate);
      const checkOutDate = new Date(booking.endDate);
      while (currentDate < checkOutDate) {
        const formattedDate = currentDate.toISOString().split('T')[0];
        unavailableDates.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return unavailableDates;
  };

  const canUploadImages = user && (user.role === 'admin' || user._id === property?.owner_id);

  if (!property) return <div>Loading...</div>;

  return (
    <div className="property-details-container">
      <div className="property-details-header">
        <h1 className="property-title">{property.title}</h1>
        {canUploadImages && (
          <button className="upload-button" onClick={() => navigate(`/property/${id}/upload-images`)}>Upload Images</button>
        )}
      </div>

      {property.imageUrls && property.imageUrls.length > 0 ? (
        <div className="property-images">
          {property.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Image of ${property.title}`}
              onClick={() => handleImageClick(url)}
              className="property-thumbnail"
            />
          ))}
        </div>
      ) : (
        <p>No images available for this property.</p>
      )}

      {/* Image Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Enlarged property view" className="modal-image" />
            <button className="close-modal" onClick={handleCloseModal}>X</button>
          </div>
        </div>
      )}

      <p className="price">Price: ${property.price} per night</p>
      <p>{property.description}</p>
      
      {/* Amenities Section */}
      <div className="amenities-section">
        <h3>What this place offers</h3>
        <div className="amenities-list">
          {Object.keys(amenitiesList).map((amenity) => {
            const isAvailable = property.amenities.includes(amenity);
            return (
              <div
                key={amenity}
                className={`amenity-item ${isAvailable ? '' : 'unavailable'}`}
              >
                <span className="amenity-icon">{amenitiesList[amenity].icon}</span>
                <span className="amenity-name">{amenitiesList[amenity].name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date picker */}
      <div className="date-picker-container">
        <AirbnbDatePicker
          unavailableDates={getUnavailableDates()}
          onDatesChange={handleDateSelection}
          onBook={handleBookingClick}
        />
      </div>

      <p className="property-location">{property.location}</p>
      <div className="map-container">
        <MapComponent latitude={property.latitude} longitude={property.longitude} />
      </div>
      
      <div className="chatbox-container">
        <Chatbox property={property} />
      </div>
    </div>
  );
};

export default PropertyDetails;
