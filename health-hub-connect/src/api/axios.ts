import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import API_CONFIG from '../config/api.config';

// Create axios instance with configuration
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Track retry attempts per request
const retryMap = new Map<string, number>();

// Request interceptor: Add token to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(API_CONFIG.token.storageKey);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Create a unique request identifier for retry tracking
    const requestKey = `${config.method}-${config.url}`;
    if (!retryMap.has(requestKey)) {
      retryMap.set(requestKey, 0);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors and retry logic
api.interceptors.response.use(
  (response) => {
    // Clear retry count on success
    const requestKey = `${response.config.method}-${response.config.url}`;
    retryMap.delete(requestKey);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: number };
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestKey = `${originalRequest.method}-${originalRequest.url}`;
    const currentRetries = retryMap.get(requestKey) || 0;

    // Retry logic for specific status codes
    if (
      API_CONFIG.retry.retryableStatusCodes.includes(error.response?.status || 0) &&
      currentRetries < API_CONFIG.retry.maxRetries &&
      originalRequest.method !== 'POST' // Don't retry POST by default (not idempotent)
    ) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      retryMap.set(requestKey, currentRetries + 1);

      // Exponential backoff
      const delay =
        API_CONFIG.retry.retryDelay * Math.pow(2, currentRetries);
      await new Promise((resolve) => setTimeout(resolve, delay));

      return api(originalRequest);
    }

    // Handle 401 Unauthorized - refresh token or logout
    if (error.response?.status === 401) {
      localStorage.removeItem(API_CONFIG.token.storageKey);
      localStorage.removeItem(API_CONFIG.token.refreshTokenKey);
      localStorage.removeItem(API_CONFIG.token.userKey);
      
      // Redirect to login (assuming router is available globally or in context)
      window.location.href = '/login';
    }

    retryMap.delete(requestKey);
    return Promise.reject(error);
  }
);

export default api;

