/**
 * API Configuration
 * Environment-based API URL configuration with security best practices
 */

const API_CONFIG = {
  // Default API URL - can be overridden by environment variable
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD
      ? 'https://api.health-hub.com'
      : 'http://localhost:5000/api'),

  // API timeout in milliseconds
  timeout: 30000,

  // Request headers
  headers: {
    'Content-Type': 'application/json',
  },

  // Retry configuration
  retry: {
    maxRetries: 3,
    retryDelay: 1000, // milliseconds
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  },

  // Token configuration
  // Keys MUST match what authSlice.ts writes to localStorage
  token: {
    storageKey: 'token',
    refreshTokenKey: 'refreshToken',
    userKey: 'user',
  },

  // Endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      signup: '/auth/signup',
      verifyOtp: '/auth/verify-otp',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      refreshToken: '/auth/refresh-token',
      logout: '/auth/logout',
    },
    doctors: {
      list: '/doctors',
      details: '/doctors/:id',
      search: '/doctors/search',
      availability: '/doctors/:id/availability',
      onboarding: '/doctors/onboarding',
      profile: '/doctors/profile',
    },
    appointments: {
      book: '/appointments/book',
      list: '/appointments',
      details: '/appointments/:id',
      cancel: '/appointments/:id/cancel',
      reschedule: '/appointments/:id/reschedule',
    },
    payments: {
      checkout: '/payments/checkout',
      verify: '/payments/verify',
      history: '/payments/history',
    },
    patients: {
      profile: '/patients/profile',
      update: '/patients/profile/update',
      appointments: '/patients/appointments',
    },
    admin: {
      dashboard: '/admin/dashboard',
      users: '/admin/users',
      analytics: '/admin/analytics',
    },
  },
};

export default API_CONFIG;
