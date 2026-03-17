import axios from 'axios';

// All requests are relative — in dev the Vite proxy forwards /api to the backend.
// In production, nginx routes /api to the API container on the same domain.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  withCredentials: true, // required so the auth_token cookie is sent with every request
});

// On any 401, clear the auth hint and redirect to login.
// This handles expired cookies without the user needing to do anything.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
