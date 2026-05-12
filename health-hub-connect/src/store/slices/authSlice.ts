import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  otpRequired: boolean;
  tempEmail: string | null;
  tempData: any | null;
  authMode: 'login' | 'signup' | 'forgotPassword' | 'resetPassword';
}

const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined') return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  otpRequired: false,
  tempEmail: null,
  tempData: null,
  authMode: 'login',
};

export const login = createAsyncThunk('auth/login', async (credentials: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data; // Now returns { otpRequired, email, role }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const verifyLoginOTP = createAsyncThunk('auth/verifyLoginOTP', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/verify-login', data);
    const { token, refreshToken, user } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
  }
});

export const signup = createAsyncThunk('auth/signup', async (userData: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data; // Now returns { otpRequired, email, tempData }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed');
  }
});

export const completeSignup = createAsyncThunk('auth/completeSignup', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/complete-signup', data);
    const { token, refreshToken, user } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Signup completion failed');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email: string, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Request failed');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Reset failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpRequired = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<any>) => {
      if (state.user) {
        state.user = { 
          ...state.user, 
          name: action.payload.doctorName || action.payload.fullName || action.payload.name || state.user.name 
        };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    setAuthMode: (state, action: PayloadAction<AuthState['authMode']>) => {
      state.authMode = action.payload;
      state.otpRequired = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.otpRequired = true;
        state.tempEmail = action.payload.data.email;
        state.tempData = { role: action.payload.data.role };
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.otpRequired = true;
        state.tempEmail = action.payload.data.email;
        state.tempData = action.payload.data.tempData;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.otpRequired = true;
        state.tempEmail = action.payload.data.email;
        state.authMode = 'resetPassword';
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.otpRequired = false;
        state.authMode = 'login';
      })
      .addMatcher(
        (action) => [verifyLoginOTP.fulfilled, completeSignup.fulfilled].some(c => action.type === c.type),
        (state, action: any) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.otpRequired = false;
          state.tempEmail = null;
          state.tempData = null;
        }
      )
      .addMatcher(
        (action) => [verifyLoginOTP.pending, completeSignup.pending, forgotPassword.pending, resetPassword.pending].some(c => action.type === c.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [verifyLoginOTP.rejected, completeSignup.rejected, forgotPassword.rejected, resetPassword.rejected].some(c => action.type === c.type),
        (state, action: any) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );

  },
});

export const { logout, clearError, setAuthMode, updateProfile } = authSlice.actions;
export default authSlice.reducer;

