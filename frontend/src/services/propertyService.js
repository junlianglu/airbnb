import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

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
    const response = await axios.get(`${API_URL}/api/location/${placeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching LatLng from Place ID:', error);
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

const getCitySuggestions = async (query) => {
  try {
    const response = await axios.post(
      `https://places.googleapis.com/v1/places:autocomplete`,
      {
        input: query,
        locationBias: {
          circle: {
            center: {
              latitude: 37.7749, // Replace with your desired coordinates
              longitude: -122.4194,
            },
            radius: 5000.0,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY, // Use your API key
        },
      }
    );
    return response.data.suggestions.map((suggestion) => suggestion.placePrediction?.text.text);
  } catch (error) {
    console.error('Failed to fetch city suggestions:', error);
    throw error;
  }
};

const fetchProperties = async ({ searchQuery, minPrice, maxPrice, sortOrder, page = 0, size = 10 }) => {
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sortOrder) params.append('sortOrder', sortOrder);
    params.append('from', page * size);
    params.append('size', size);

    const response = await fetch(`${API_URL}/api/properties/search?${params.toString()}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    return [];
  }
};

const getAllProperties = async () => {
  const response = await axios.get(`${API_URL}/api/properties`);
  return response.data;
};

const getPropertyById = async (id) => {
  const response = await axios.get(`${API_URL}/api/properties/${id}`);
  return response.data;
};

const getBookedDates = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/properties/${id}/booked-dates`);
    return response.data; // Return booked dates from the response
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    return [];
  }
};

const createProperty = async (propertyData) => {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Pass the token for authorization
    },
  };
  const response = await axios.post(`${API_URL}/api/properties`, propertyData, config);
  return response.data;
};

const uploadPropertyImages = async (propertyId, formData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is used for file uploads
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/api/properties/${propertyId}/images`, formData, config);
  return response.data;
};

const propertyService = {
  getLatLngFromLocation,
  getCitySuggestions,
  fetchProperties,
  getAllProperties,
  getPropertyById,
  getBookedDates,
  createProperty,
  uploadPropertyImages
};

export default propertyService;
