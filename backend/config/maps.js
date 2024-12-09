// Define Google Maps configuration with environment-based settings
export const GOOGLE_MAPS_CONFIG = {
  // Libraries to load with Google Maps
  libraries: ['places', 'geometry'],

  // API Key from environment variable
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,

  // Default map center (can be overridden)
  defaultCenter: {
    lat: parseFloat(process.env.DEFAULT_MAP_LAT || '40.7128'),
    lng: parseFloat(process.env.DEFAULT_MAP_LNG || '-74.0060')
  },

  // Default zoom level
  defaultZoom: parseInt(process.env.DEFAULT_MAP_ZOOM || '12'),

  // Additional map configuration options
  mapOptions: {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    mapTypeControl: false
  },

  // Validate configuration
  validate() {
    if (!this.apiKey) {
      throw new Error('Google Maps API Key is required');
    }
  }
};

// Validate configuration on import
GOOGLE_MAPS_CONFIG.validate();

// Export additional utility functions for geospatial calculations
export const calculateDistance = (point1, point2) => {
  // Haversine formula for calculating distance between two points
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(point2.lat - point1.lat);
  const dLon = toRadians(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

const toRadians = (degrees) => {
  return degrees * (Math.PI/180);
};