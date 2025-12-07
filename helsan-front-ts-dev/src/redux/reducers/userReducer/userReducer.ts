import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileInfo: null,
  profileLoading: false,
  userRegisterFormValues: null,
  userLoginFormValues: null,
  userHistory: [],
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfileInfo: (state, { payload }) => {
      state.profileInfo = payload;
    },
    setProfileLoading: (state, { payload }) => {
      state.profileLoading = payload;
    },
    setUserRegisterFormValues: (state, { payload }) => {
      state.userRegisterFormValues = payload;
    },
    setUserLoginFormValues: (state, { payload }) => {
      state.userLoginFormValues = payload;
    },
    setUsersHistory: (state, { payload }) => {
      state.userHistory = payload;
    },
  },
});

export const {
  setProfileInfo,
  setProfileLoading,
  setUserRegisterFormValues,
  setUserLoginFormValues,
  setUsersHistory,
} = userReducer.actions;
export default userReducer.reducer;
