import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { RootState } from '../index';

interface DataState {
  doctors: any[];
  patients: any[];
  hospitals: any[];
  appointments: any[];
  tasks: any[];
  schedules: any[];
  specialties: any[];
  slots: any[];
  profile: any | null;
  stats: any | null;
  earnings: any | null;
  wallet: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  doctors: [],
  patients: [],
  hospitals: [],
  appointments: [],
  tasks: [],
  schedules: [],
  specialties: [],
  slots: [],
  profile: null,
  stats: null,
  earnings: null,
  wallet: null,
  loading: false,
  error: null,
};

export const fetchDoctors = createAsyncThunk('data/fetchDoctors', async (params: any = {}, { rejectWithValue }) => {
  try {
    const response = await api.get('/doctors', { params });
    return response.data.data; // Backend wraps in { success, data, message }
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctors');
  }
});

export const fetchHospitals = createAsyncThunk('data/fetchHospitals', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/hospitals');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch hospitals');
  }
});

export const fetchSpecialties = createAsyncThunk('data/fetchSpecialties', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/doctors/specialties'); 
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch specialties');
  }
});
export const fetchProfile = createAsyncThunk('data/fetchProfile', async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState() as RootState;
    const role = state.auth.user?.role;
    const endpoint = role === 'DOCTOR' ? '/doctors/profile' : '/patients/profile';
    const response = await api.get(endpoint);
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
  }
});

export const toggleDoctorStatus = createAsyncThunk('data/toggleDoctorStatus', async (isOnline: boolean, { rejectWithValue }) => {
  try {
    const response = await api.put('/doctors/status', { isOnline });
    return isOnline;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update status');
  }
});

export const fetchPatientAppointments = createAsyncThunk('data/fetchPatientAppointments', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/appointments/my-appointments');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch your appointments');
  }
});

export const fetchDoctorAppointments = createAsyncThunk('data/fetchDoctorAppointments', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/appointments/doctor');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctor appointments');
  }
});

export const fetchDoctorPatients = createAsyncThunk('data/fetchDoctorPatients', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/doctors/patients');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch patients');
  }
});

export const fetchTasks = createAsyncThunk('data/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/doctors/tasks');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const fetchSchedules = createAsyncThunk('data/fetchSchedules', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/doctors/schedule');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch schedules');
  }
});

export const fetchDoctorSlots = createAsyncThunk('data/fetchDoctorSlots', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/doctors/slots');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch slots');
  }
});

export const fetchPublicDoctorSlots = createAsyncThunk('data/fetchPublicDoctorSlots', async (doctorId: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/doctors/${doctorId}/slots`);
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctor slots');
  }
});

export const fetchEarnings = createAsyncThunk('data/fetchEarnings', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/doctors/earnings');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch earnings');
  }
});

export const fetchWallet = createAsyncThunk('data/fetchWallet', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/doctors/wallet');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch wallet');
  }
});

export const onboardStripe = createAsyncThunk('data/onboardStripe', async (_, { rejectWithValue }) => {
  try {
    const response = await api.post('/payments/stripe/onboard');
    return response.data.data; // Should contain the onboarding URL
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to initiate onboarding');
  }
});

export const createTask = createAsyncThunk('data/createTask', async (taskData: any, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.post('/doctors/tasks', taskData);
    dispatch(fetchTasks());
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create task');
  }
});

export const createSchedule = createAsyncThunk('data/createSchedule', async (scheduleData: any, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.post('/doctors/schedule', scheduleData);
    dispatch(fetchSchedules());
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create schedule');
  }
});

export const fetchAdminUsers = createAsyncThunk('data/fetchAdminUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/admin/users');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});

export const fetchAdminStats = createAsyncThunk('data/fetchAdminStats', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch admin stats');
  }
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearDataError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        const rawDoctors = Array.isArray(action.payload) ? action.payload : [];
        state.doctors = rawDoctors.map(d => ({
          id: d.id,
          name: d.doctorName,
          specialty: d.specialization?.typeName || 'General Specialist',
          qualifications: d.qualification || 'Medical Professional',
          experience: d.experienceYears || 0,
          rating: d.averageRating || 4.5,
          reviews: d.totalReviews || 120,
          fee: d.consultationFee || 500,
          image: d.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.doctorName}`,
          hospital: d.hospital?.hospitalName || 'Health Hub Center',
          location: d.hospital?.city || 'Main City',
          languages: d.languages?.map((l: any) => l.language) || ['English', 'Hindi'],
          consultationTypes: d.consultationType ? [d.consultationType.toLowerCase()] : ['video', 'in-person'],
          nextSlot: 'Tomorrow, 10:00 AM',
          online: d.status === 'ACTIVE',
          bio: d.bio || 'Experienced healthcare professional dedicated to patient care.',
          about: d.bio || 'Dedicated medical professional with a focus on holistic patient care and modern treatment methodologies.',
          timings: [{ day: 'Mon – Fri', hours: '09:00 AM – 06:00 PM' }]
        }));
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        const rawHospitals = Array.isArray(action.payload) ? action.payload : [];
        state.hospitals = rawHospitals.map(h => ({
          id: h.id,
          name: h.hospitalName,
          location: h.city || h.address || 'Location N/A',
          type: h.hospitalType || 'General'
        }));
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.specialties = action.payload.map((s: any) => ({
          name: s.typeName,
          icon: s.icon || 'Activity',
          count: s.count || 0
        }));
      })
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.appointments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.appointments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDoctorPatients.fulfilled, (state, action) => {
        state.patients = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.doctors = action.payload.doctors || [];
        state.patients = action.payload.patients || [];
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.schedules = action.payload;
      })
      .addCase(fetchDoctorSlots.fulfilled, (state, action) => {
        state.slots = action.payload;
      })
      .addCase(fetchPublicDoctorSlots.fulfilled, (state, action) => {
        state.slots = action.payload;
      })
      .addCase(fetchEarnings.fulfilled, (state, action) => {
        state.earnings = action.payload;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.wallet = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(toggleDoctorStatus.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.isOnline = action.payload;
        }
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSchedule.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearDataError } = dataSlice.actions;
export default dataSlice.reducer;
