const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

router.get('/:placeId', async (req, res) => {
  const { placeId } = req.params;
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
      res.json({
        lat: location.latitude,
        lng: location.longitude,
      });
    } else {
      res.status(404).json({ error: 'Location data not found.' });
    }
  } catch (error) {
    console.error('Error fetching LatLng from Place ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch location data.' });
  }
});

module.exports = router;
