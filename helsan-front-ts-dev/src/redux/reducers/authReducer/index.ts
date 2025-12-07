import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isLoggedIn: false,
  userRole: null,
  loginStep: "login", // مرحله جاری فرایند ورود (login, loginVerification, done و ...)
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn: (state, { payload }) => {
      state.isLoggedIn = payload;
    },
    setLoginStep: (state, { payload }) => {
      state.loginStep = payload;
    },
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.loginStep = "login"; // ریست مرحله هنگام خروج کاربر
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setUserRole: (state, { payload }) => {
      state.userRole = payload;
    },
  },
});

export const {
  login,
  logout,
  setIsLoggedIn,
  setLoading,
  setUserRole,
  setLoginStep,
} = auth.actions;

export default auth.reducer;
