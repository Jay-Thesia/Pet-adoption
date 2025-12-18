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

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<any>>) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
      
      if (isAuthEndpoint) {
        const errorMessage = error.response.data?.message || 'Invalid credentials';
        toast.error(errorMessage);
        return Promise.reject(error);
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (error.response?.status === 400 && error.response.data?.errors && Array.isArray(error.response.data.errors)) {
      const validationErrors = error.response.data.errors;
      
      if (validationErrors.length === 1) {
        const err = validationErrors[0];
        toast.error(`${err.field}: ${err.message}`);
      } else {
        toast.error(`Validation failed: ${validationErrors.length} error(s) found`);
        validationErrors.forEach((err, index) => {
          setTimeout(() => {
            toast.error(`${err.field}: ${err.message}`, {
              position: 'top-right',
              autoClose: 3000
            });
          }, (index + 1) * 100);
        });
      }
      return Promise.reject(error);
    }

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

