// API Configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:9000',
    SOCKET_URL: 'http://localhost:9000'
  },
  production: {
    API_BASE_URL: '',  // Same origin for Vercel
    SOCKET_URL: window.location.origin
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_CONFIG = config[environment];

export const API_BASE_URL = API_CONFIG.API_BASE_URL;
export const SOCKET_URL = API_CONFIG.SOCKET_URL;
