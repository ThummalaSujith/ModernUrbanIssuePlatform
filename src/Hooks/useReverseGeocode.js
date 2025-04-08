// hooks/useReverseGeocode.js
import { useState, useEffect } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

export const useReverseGeocode = (lat, lng) => {
  const [address, setAddress] = useState('');
  const geocodingLibrary = useMapsLibrary('geocoding');

  useEffect(() => {
    if (!geocodingLibrary || typeof lat !== 'number' || typeof lng !== 'number') return;

    const geocoder = new geocodingLibrary.Geocoder();
    
    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === 'OK' && results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress('Location not available');
        }
      }
    );
  }, [geocodingLibrary, lat, lng]);

  return address;
};