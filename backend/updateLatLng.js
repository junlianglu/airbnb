const mongoose = require('mongoose');
const axios = require('axios');
const Property = require('./models/Property'); // Adjust path as needed
require('dotenv').config(); // For MongoDB connection URI
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', async () => {
    console.log('Connected to MongoDB');
    try {
      const properties = await Property.find({});
      for (const property of properties) {
        if (!property.latitude || !property.longitude) { // Update only if lat/lng is missing
          const coordinates = await getLatLngFromLocation(property.location);
          if (coordinates) {
            property.latitude = coordinates.lat;
            property.longitude = coordinates.lng;
            await property.save();
            console.log(`Updated property ${property._id} with latitude and longitude.`);
          }
        }
      }
    } catch (error) {
      console.error('Error updateing properties:', error);
    } finally {
      mongoose.connection.close(); // Close MongoDB connection
    }
  });

// Get Place ID from Autocomplete
const getPlaceId = async (location) => {
  try {
    const response = await axios.post(
      `https://places.googleapis.com/v1/places:autocomplete`,
      {
        input: location,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        },
      }
    );
    const placeId = response.data.suggestions[0]?.placePrediction?.placeId;
    return placeId;
  } catch (error) {
    console.error('Error fetching Place ID:', error);
  }
};

// Get Latitude and Longitude from Place ID
const getLatLngFromPlaceId = async (placeId) => {
    try {
      const response = await axios.get(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask': 'location',
          },
        }
      );
  
      const location = response.data.location;
      if (location) {
        return {
            lat: location.latitude,
            lng: location.longitude,
        };
      }
    } catch (error) {
      console.error('Error fetching LatLng from Place ID:', error.message);
    }
};


// Fetch Latitude and Longitude based on location string
const getLatLngFromLocation = async (location) => {
  const placeId = await getPlaceId(location);
  if (placeId) {
    const latLng = await getLatLngFromPlaceId(placeId);
    return latLng;
  }
  return null;
};