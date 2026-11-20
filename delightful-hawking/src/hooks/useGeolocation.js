import { useEffect, useState } from 'react';
import { USER_LOCATION } from '../utils/geo';

export function useGeolocation() {
  const [state, setState] = useState({
    location: USER_LOCATION,
    status: 'loading', // 'loading' | 'success' | 'error'
    isFallback: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ location: USER_LOCATION, status: 'error', isFallback: true });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: { lat: position.coords.latitude, lng: position.coords.longitude },
          status: 'success',
          isFallback: false,
        });
      },
      () => {
        setState({ location: USER_LOCATION, status: 'error', isFallback: true });
      },
      { timeout: 8000 }
    );
  }, []);

  return state;
}
