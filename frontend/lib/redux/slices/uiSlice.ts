import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarCollapsed: boolean;
  notification: {
    type: 'success' | 'error' | 'info' | 'warning' | null;
    message: string | null;
  };
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
  darkMode: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  notification: {
    type: null,
    message: null,
  },
  loading: {
    global: false,
  },
  darkMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setNotification: (
      state,
      action: PayloadAction<{
        type: 'success' | 'error' | 'info' | 'warning';
        message: string;
      }>
    ) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = {
        type: null,
        message: null,
      };
    },
    setLoading: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      const { key, isLoading } = action.payload;
      state.loading = {
        ...state.loading,
        [key]: isLoading,
      };
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setNotification,
  clearNotification,
  setLoading,
  setGlobalLoading,
  toggleDarkMode,
  setDarkMode,
} = uiSlice.actions;

export default uiSlice.reducer;