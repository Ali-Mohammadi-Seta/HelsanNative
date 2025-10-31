// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, UserProfile, RegisterData, LoginCredentials } from '@/types/auth.types';

const initialState: UserState = {
  profileInfo: null,
  profileLoading: false,
  userRegisterFormValues: null,
  userLoginFormValues: null,
  userHistory: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfileInfo: (state, action: PayloadAction<UserProfile | null>) => {
      state.profileInfo = action.payload;
    },

    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.profileLoading = action.payload;
    },

    setUserRegisterFormValues: (state, action: PayloadAction<RegisterData | null>) => {
      state.userRegisterFormValues = action.payload;
    },

    setUserLoginFormValues: (state, action: PayloadAction<LoginCredentials | null>) => {
      state.userLoginFormValues = action.payload;
    },

    setUsersHistory: (state, action: PayloadAction<any[]>) => {
      state.userHistory = action.payload;
    },

    // Update specific profile fields
    updateProfileField: <K extends keyof UserProfile>(
      state: UserState,
      action: PayloadAction<{ field: K; value: UserProfile[K] }>
    ) => {
      if (state.profileInfo) {
        state.profileInfo[action.payload.field] = action.payload.value;
      }
    },

    // Clear user data on logout
    clearUserData: (state) => {
      state.profileInfo = null;
      state.userRegisterFormValues = null;
      state.userLoginFormValues = null;
      state.userHistory = [];
    },
  },
});

export const {
  setProfileInfo,
  setProfileLoading,
  setUserRegisterFormValues,
  setUserLoginFormValues,
  setUsersHistory,
  updateProfileField,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer;