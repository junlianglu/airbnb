import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import propertyService from '../services/propertyService';
import { useNavigate } from 'react-router-dom';
import './CreateProperty.css';

const CreateProperty = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasSelectedImages, setHasSelectedImages] = useState(false);
  const [amenities, setAmenities] = useState({
    WiFi: false,
    Pool: false,
    Kitchen: false,
    "Air Conditioning": false,
    "Free Parking": false,
    "Pet Friendly": false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      navigate('/'); // Redirect to the homepage or another appropriate page
    }
  }, [user, navigate]);

  const fetchCitySuggestions = async (query) => {
    try {
      const results = await propertyService.getCitySuggestions(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Failed to fetch city suggestions:', error);
    }
  };

  const handleLocationChange = (e) => {
    const query = e.target.value;
    setLocation(query);
    if (query.length > 1) {
      fetchCitySuggestions(query);
    } else {
      setSuggestions([]);
    }
  };

  const selectLocation = (city) => {
    setLocation(city);
    setSuggestions([]);
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setAmenities((prevAmenities) => ({
      ...prevAmenities,
      [name]: checked,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setHasSelectedImages(files.length > 0);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    // Ensure price is positive
    if (price <= 0) {
      return;
    }

    const latLng = await propertyService.getLatLngFromLocation(location);
    const latitude = latLng.lat;
    const longitude = latLng.lng;
    const selectedAmenities = Object.keys(amenities).filter((amenity) => amenities[amenity]);

    const newProperty = {
      title,
      description,
      price,
      location,
      latitude,
      longitude,
      amenities: selectedAmenities,
    };

    try {
      const property = await propertyService.createProperty(newProperty);
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i]);
      }
      try {
        await propertyService.uploadPropertyImages(property._id, formData);
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload images');
        return;
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to create property:', error);
      alert('Failed to create property');
    }
  };

  return (
    <div className="create-property-container">
      <h2>Create New Property</h2>
      <form onSubmit={handleCreate} className="create-property-form">
        
        <div className="form-group">
          <label>Property Title</label>
          <input
            type="text"
            placeholder="Enter property title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Property Description</label>
          <textarea
            placeholder="Describe the property"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Price per Night</label>
          <input
            type="number"
            placeholder="Enter price per night"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="1" // Ensures only positive values are allowed
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={handleLocationChange}
            required
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((city, index) => (
                <li key={index} onClick={() => selectLocation(city)}>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <h4>Select Amenities</h4>
          {Object.keys(amenities).map((amenity) => (
            <label key={amenity} className="amenities-checkbox">
              <input
                type="checkbox"
                name={amenity}
                checked={amenities[amenity]}
                onChange={handleAmenityChange}
              />
              {amenity}
            </label>
          ))}
        </div>

        <div className="upload-images-section form-group">
          <h4>Upload Images</h4>
          <input type="file" multiple onChange={handleFileChange} />
          {!hasSelectedImages && <p className="error-message">Please upload at least one image.</p>}
        </div>

        <button type="submit" className="create-button" disabled={!hasSelectedImages}>
          Create Property
        </button>
      </form>
    </div>
  );
};

export default CreateProperty;
