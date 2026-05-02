// lib/api-config.ts
// This file is used on both client and server to get the API URL.

const getApiBaseUrl = () => {
  // 1. Check for the environment variable
  let url = process.env.NEXT_PUBLIC_API_URL;

  // 2. Fallback to production if not set
  if (!url) {
    // url = 'https://flexicore1.onrender.com';
    url = 'http://localhost:5001';
  }

  // 3. Remove trailing slash
  url = url.replace(/\/$/, '');

  return url;
};

export const API_BASE_URL = getApiBaseUrl();

// Ensure we don't double up on /api
export const API_BASE = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

console.log('API_BASE configured as:', API_BASE);
