import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ApiResponse } from '../types';
import config from '../config';

const api: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<any>>) => {
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle other errors
    if (error.response) {
      const errorMessage = error.response.data?.message || 
                          (error.response.data?.errors && error.response.data.errors[0]?.message) ||
                          'An error occurred';
      toast.error(errorMessage);
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred');
    }

    return Promise.reject(error);
  }
);

export default api;

