// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, LoginStep, UserRole } from '@/types/auth.types';
import config from '@/config';

const initialState: AuthState = {
  loading: false,
  isLoggedIn: false,
  userRole: null,
  loginStep: 'login',
  accessToken: null,
  refreshToken: null,
  challenge: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set login step
    setLoginStep: (state, action: PayloadAction<LoginStep>) => {
      state.loginStep = action.payload;
    },

    // Set challenge (for OTP verification)
    setChallenge: (state, action: PayloadAction<string | null>) => {
      state.challenge = action.payload;
    },

    // Login success - store tokens
    loginSuccess: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        userRole?: UserRole;
      }>
    ) => {
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      if (action.payload.userRole) {
        state.userRole = action.payload.userRole;
      }
      state.loginStep = 'done';
      state.loading = false;

      // Persist tokens
      AsyncStorage.setItem(config.userAccessToken, action.payload.accessToken);
      AsyncStorage.setItem(config.userRefreshToken, action.payload.refreshToken);
    },

    // Set user role
    setUserRole: (state, action: PayloadAction<UserRole>) => {
      state.userRole = action.payload;
    },

    // Set logged in status
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },

    // Update access token (used after refresh)
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      AsyncStorage.setItem(config.userAccessToken, action.payload);
    },

    // Logout
    logout: (state) => {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.userRole = null;
      state.loginStep = 'login';
      state.challenge = null;
      state.loading = false;

      // Clear stored tokens
      AsyncStorage.multiRemove([
        config.userAccessToken,
        config.userRefreshToken,
        config.userIsikatoToken,
        config.frontToken,
      ]);
    },

    // Restore session (called on app start)
    restoreSession: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoggedIn = true;
    },
  },
});

// Thunk to restore session on app start
export const restoreAuthSession = () => async (dispatch: any) => {
  try {
    const accessToken = await AsyncStorage.getItem(config.userAccessToken);
    const refreshToken = await AsyncStorage.getItem(config.userRefreshToken);

    if (accessToken && refreshToken) {
      dispatch(restoreSession({ accessToken, refreshToken }));
      console.log('✅ [AUTH] Session restored');
    } else {
      console.log('ℹ️ [AUTH] No session to restore');
    }
  } catch (error) {
    console.error('❌ [AUTH] Failed to restore session:', error);
  }
};

export const {
  setLoading,
  setLoginStep,
  setChallenge,
  loginSuccess,
  setUserRole,
  setIsLoggedIn,
  updateAccessToken,
  logout,
  restoreSession,
} = authSlice.actions;

export default authSlice.reducer;