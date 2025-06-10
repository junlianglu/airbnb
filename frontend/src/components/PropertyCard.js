import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === property.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? property.imageUrls.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="property-card">
      {property.imageUrls && property.imageUrls.length > 0 ? (
        <Link to={`/property/${property._id}`} className="property-card-image-carousel">
          <button onClick={(e) => { e.preventDefault(); prevImage(); }} className="carousel-button">◀</button>
          <img
            src={property.imageUrls[currentImageIndex]}
            alt={`Image of ${property.title} - ${currentImageIndex + 1}`}
            className="property-image"
          />
          <button onClick={(e) => { e.preventDefault(); nextImage(); }} className="carousel-button">▶</button>
        </Link>
      ) : (
        <p>No images available.</p>
      )}

      <h3>{property.title}</h3>
      <p>{property.location}</p>
      <p>Price: ${property.price}</p>
    </div>
  );
};

export default PropertyCard;
