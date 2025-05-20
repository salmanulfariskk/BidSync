import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axios from '../../axios';

interface User {
  id: string;
  email?: string;
  name? : string;
  role?: 'BUYER' | 'SELLER';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Parse user from token
const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<{ user: User }>(token);
    return {
      id: decoded?.user?.id,
      role: decoded?.user?.role,
    };
  } catch (err) {
    return null;
  }
};

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;
      console.log("user--res-->", user)
      localStorage.setItem('token', token);
      return { token, user };
    } catch (err: any) {
      console.log("error---->", err)
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (
    { name, email, password, role }: { name: string; email: string; password: string; role: 'BUYER' | 'SELLER' },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/auth/register', { name, email, password, role });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      return { token, user};
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  return null;
});

// Get user profile
export const getUserProfile = createAsyncThunk('auth/getUserProfile', async (_, { rejectWithValue, getState }) => {
  try {
    const response = await axios.get('/auth/profile');
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to get user profile');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      state.token = token;
      state.user = getUserFromToken(token);
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;