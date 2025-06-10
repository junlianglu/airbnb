import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = ({ latitude, longitude }) => {
  const position = { lat: latitude, lng: longitude };
  alert(latitude);
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '300px' }}
        center={position}
        zoom={15}
        mapId="a1d144f9737088b0" 
      >
        {/* Standard Marker Example */}
        <Marker position={position} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;